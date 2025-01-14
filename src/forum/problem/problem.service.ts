import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SearchProblemDto } from './dto/search-problem.dto';
import { Problem } from './schemas/problem.schema';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { ProblemRepository } from './repository/problem.repository';
import { LogService } from '../log/log.service';
import { LogActions } from '../log/enum/log-actions.enum';
import { targetModels } from '../log/enum/log-models.enum';
import { DuplicateException } from '../../exceptions/duplicate-problem.exception';
import { RateLimitService } from '../rate-limit/rate-limit.service';
import { Counts } from './enums/counts.enum';
import { UpdateProblemCountsDto } from './dto/update-problem-counts.dto';
import { TooManyRequestsException } from 'src/exceptions/too-many-requests-exception';
import { DatabaseException } from 'src/exceptions/database.exception';
import { UnauthorizedAccessException } from 'src/exceptions/unauthorized-access.exception';
import { DeleteResult, Types } from 'mongoose';
import { SolutionService } from '../solution/solution.service';

/**
 * Service class for managing Problem entities.
 * This class provides methods to handle business logic related to Problem operations,
 * including creation, updating, searching, and deletion of problems.
 * It also integrates with logging, rate limiting, and other utility services.
 */
@Injectable()
export class ProblemService {
  /**
   * Constructs the ProblemService.
   * @param problemRepository - The repository for interacting with Problem documents in the database.
   * @param logService - The service for logging actions related to Problem entities.
   * @param rateLimitService - The service for enforcing rate limits on certain operations.
   */
  constructor(
    private readonly problemRepository: ProblemRepository,
    private readonly logService: LogService,
    private readonly rateLimitService: RateLimitService,

    @Inject(forwardRef(() => SolutionService))
    private solutionService: SolutionService,
  ) {}

  /**
   * Updates the count of a specified type for a given problem.
   *
   * @param {Types.ObjectId} problemId - The ID of the problem to update.
   * @param {boolean} isIncrease - Determines whether to increase or decrease the count.
   * @param {Counts} countType - The type of count to update (e.g., VOTES, VIEWS, SOLUTION_COUNT).
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the count was successfully updated, otherwise `false`.
   *
   * @throws {BadRequestException} - If the provided count type is invalid or if updating the count fails.
   * @throws {DatabaseException} - If fetching the problem from the database fails.
   *
   * @example
   * ```typescript
   * const problemId = new Types.ObjectId("60d21b4667d0d8992e610c85");
   * const isIncrease = true;
   * const countType = Counts.VOTES;
   *
   * changeCounts(problemId, isIncrease, countType)
   *   .then((result) => {
   *     console.log(`Count update successful: ${result}`);
   *   })
   *   .catch((error) => {
   *     console.error(`Error updating count: ${error.message}`);
   *   });
   * ```
   */
  private changeCounts(
    problemId: Types.ObjectId,
    isIncrease: boolean,
    countType: Counts,
  ): Promise<boolean> {
    let count: number;
    const problem = this.getProblem(problemId)
      .then(async (problem) => {
        const multiplier = isIncrease ? 1 : -1;
        switch (countType) {
          case Counts.DOWN_VOTES:
            count = problem.downVotes + 1;
            break;
          case Counts.UP_VOTES:
            count = problem.upVotes + 1;
            break;
          case Counts.VIEWS:
            count = problem.views + 1;
            break;
          case Counts.SOLUTION_COUNT:
            count = problem.solutionCount + multiplier;
            break;
          default:
            throw new BadRequestException(`${countType} is Invalid Count Type`);
            break;
        }
        const newCount: UpdateProblemCountsDto = {
          problemId,
          countType,
          count,
        };
        const updatedProblem = await this.problemRepository
          .updateCounts(newCount)
          .catch((error) => {
            const errorMsg = `Failed to ${isIncrease ? 'increase' : 'decrease'} the ${countType} count : ${error.message}`;
            console.log(errorMsg);
            throw new BadRequestException(errorMsg);
          });
        console.log(updatedProblem);
        return !!updatedProblem;
      })
      .catch((error) => {
        const errorMsg = `Failed to fetch the problem with ID '${problemId}' from the database. Error details: ${error.message}.`;
        console.log(errorMsg);
        throw new DatabaseException(errorMsg);
      });
    return problem;
  }

  /**
   * Rolls back the changes made to a specific Problem document.
   * @param problem - The Problem document to roll back.
   * @returns A Promise that resolves when the rollback operation is complete.
   * @throws DatabaseException - If the rollback operation fails.
   */
  private async rollbackProblem(problem: Problem): Promise<void> {
    await this.problemRepository
      .rollBackProblem(problem)
      .catch((rollbackError) => {
        console.error(
          `Rollback operation failed for the problem with ID: ${problem._id}.`,
          rollbackError,
        );
        throw new DatabaseException(
          `Failed to rollback changes for the problem with ID: ${problem._id}. Error details: ${rollbackError.message}`,
        );
      });
    return Promise.resolve();
  }
  /**
   * Retrieves the ID of the user who is currently logged in.
   * @returns The ID of the user who is currently logged in.
   */
  private getUserID(): Types.ObjectId {
    return new Types.ObjectId('6781080039c7df8d42da6ecd'); // Hardcoded for now as we don't have authentication yet
  }

  /**
   * Retrieves a specific Problem document by its ID.
   * @param id - The ID of the problem to retrieve.
   * @returns A Promise that resolves to the retrieved Problem document.
   */
  async getProblem(id: Types.ObjectId): Promise<Problem> {
    const problem = await this.problemRepository.getProblem(id);
    if (!problem) {
      throw new NotFoundException(
        `No problem exists with the given ID '${id}'.`,
      );
    }
    return problem;
  }

  /**
   * Creates a new Problem document in the database.
   * @param newProblem - The data transfer object containing the details of the problem to be created.
   * @returns A Promise that resolves to the created Problem document.
   * @throws TooManyRequestsException - If the user is rate-limited for creating problems.
   * @throws DuplicateException - If a problem with a similar title already exists.
   * @throws LogFailureException - If logging the creation action fails.
   * @throws DatabaseException - If the problem cannot be created.
   */
  async createProblem(newProblem: CreateProblemDto): Promise<Problem> {
    const userId = this.getUserID();

    const isRateLimited = await this.rateLimitService.isRateLimited(
      userId,
      'create_problem',
    );
    if (isRateLimited) {
      throw new TooManyRequestsException(
        'You are creating problems too quickly. Please wait and try again.',
      );
    }
    const existingProblems = await this.problemRepository.searchProblem({
      title: newProblem.title,
    });
    if (existingProblems && existingProblems.length > 0) {
      throw new DuplicateException(
        'A problem with a similar title already exists.',
      );
    }
    newProblem.createdBy = userId;
    const problem = await this.problemRepository
      .createProblem(newProblem)
      .then(async (problem) => {
        await this.logService.createLog(
          {
            userId: problem.createdBy,
            action: LogActions.CREATE,
            targetId: problem._id,
            targetModel: targetModels.PROBLEM,
          },
          async () => {
            return await this.problemRepository
              .deleteProblem(problem._id)
              .catch((rollbackError) => {
                console.error(
                  `Rollback operation failed for the problem with ID: ${problem._id}.`,
                  rollbackError,
                );
                throw new DatabaseException(
                  `Failed to rollback changes for the problem with ID: ${problem._id}. Error details: ${rollbackError.message}`,
                );
              });
          },
        );
        return problem;
      })
      .catch(async (error) => {
        await this.logService.createLog({
          userId: userId,
          action: LogActions.CREATE,
          details: `Unable to create the problem: ${error.message}`,
          isSuccess: false,
          targetModel: targetModels.PROBLEM,
        });
        throw new DatabaseException(
          `Unable to create the problem: ${error.message}`,
        );
      });

    return problem;
  }

  /**
   * Updates an existing Problem document in the database.
   * @param id - The ID of the problem to update.
   * @param updatedProblem - The data transfer object containing the updated details of the problem.
   * @returns A Promise that resolves to the updated Problem document.
   * @throws UnauthorizedAccessException - If the user is not authorized to update the problem.
   * @throws DatabaseException - If the problem cannot be updated.
   */
  async updateProblem(
    id: Types.ObjectId,
    updatedProblem: UpdateProblemDto,
  ): Promise<Problem> {
    updatedProblem.id = id;

    const userId: any = this.getUserID();

    const originalProblem = await this.problemRepository.getProblem(
      updatedProblem.id,
    );

    if (!originalProblem) {
      throw new NotFoundException(
        `Cannot delete problem with ID '${id}'. Problem not found.`,
      );
    }

    if (originalProblem.createdBy !== userId) {
      throw new UnauthorizedAccessException(
        'You are not authorized to update this problem.',
      );
    }

    const problem = await this.problemRepository
      .updateProblem(updatedProblem)
      .then(async (problem) => {
        await this.logService.createLog(
          {
            userId: userId,
            action: LogActions.UPDATE,
            targetId: problem._id,
            targetModel: targetModels.PROBLEM,
          },
          () => this.rollbackProblem(problem),
        );
        return problem;
      })
      .catch(async (error) => {
        await this.logService.createLog({
          userId: userId,
          action: LogActions.UPDATE,
          details: `Unable to update the problem: ${error.message}`,
          isSuccess: false,
          targetModel: targetModels.PROBLEM,
        });
        throw new DatabaseException(
          `Unable to update the problem: ${error.message}`,
        );
      });

    return problem;
  }

  /**
   * Searches for Problem documents based on a filter.
   * @param searchProblemDto - The data transfer object containing the search criteria.
   * @returns A Promise that resolves to an array of Problem documents that match the search criteria.
   * @throws DatabaseException - If the search operation fails.
   */
  async searchProblem(searchProblemDto: SearchProblemDto): Promise<Problem[]> {
    const { title, status } = searchProblemDto;
    let filter: any = {};

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    if (status) {
      filter.status = status.toUpperCase();
    }

    const problems = await this.problemRepository
      .searchProblem(filter)
      .catch((error) => {
        const errMsg = `Unable to search the problem: ${error.message}`;
        console.error(errMsg);
        throw new DatabaseException(errMsg);
      });
    return problems;
  }

  /**
   * Retrieves all Problem documents from the database.
   * @returns A Promise that resolves to an array of all Problem documents.
   * @throws DatabaseException - If the retrieval operation fails.
   */
  async getAllProblem(): Promise<Problem[]> {
    const problems = await this.problemRepository
      .getAllProblems()
      .catch((error) => {
        const errMsg = `Unable to get all problems: ${error.message}`;
        console.error(errMsg);
        throw new DatabaseException(errMsg);
      });
    return problems;
  }

  /**
   * Votes on a specific problem (upvote or downvote).
   * @param id - The ID of the problem to vote on.
   * @param isUpVote - Whether the vote is an upvote or downvote.
   * @returns A Promise that resolves to a boolean indicating whether the vote was successful.
   */
  async vote(id: Types.ObjectId, isUpVote: boolean): Promise<boolean> {
    return this.changeCounts(
      id,
      isUpVote,
      isUpVote ? Counts.UP_VOTES : Counts.DOWN_VOTES,
    );
  }

  /**
   * Adds a solution to a specific problem.
   * @param id - The ID of the problem to which the solution will be added.
   * @param solutionId - The ID of the solution to be added.
   * @returns A Promise that resolves to a boolean indicating whether the solution was added successfully.
   * @throws DatabaseException - If the solution cannot be added.
   */
  async addSolution(
    problemId: Types.ObjectId,
    solutionId: Types.ObjectId,
  ): Promise<boolean> {
    const problem = this.problemRepository
      .addSolution(problemId, solutionId)
      .catch((error) => {
        const errMsg = `Unable to add solution to the problem: ${error.message}`;
        console.error(errMsg);
        throw new DatabaseException(errMsg);
      });
    this.changeCounts(problemId, true, Counts.SOLUTION_COUNT);
    if (!problem) {
      throw new NotFoundException(
        `Unable to add solution: Problem with ID '${problemId}' not found.`,
      );
    }
    return !!problem;
  }

  /**
   * Removes a solution from a specific problem.
   * @param id - The ID of the problem from which the solution will be removed.
   * @param solutionId - The ID of the solution to be removed.
   * @returns A Promise that resolves to a boolean indicating whether the solution was removed successfully.
   * @throws DatabaseException - If the solution cannot be removed.
   */
  async removeSolution(
    id: Types.ObjectId,
    solutionId: Types.ObjectId,
  ): Promise<boolean> {
    const problem = this.problemRepository
      .removeSolution(id, solutionId)
      .catch((error) => {
        const errMsg = `Unable to remove solution from the problem: ${error.message}`;
        console.error(errMsg);
        throw new DatabaseException(errMsg);
      });
    this.changeCounts(id, false, Counts.SOLUTION_COUNT);
    return !!problem;
  }

  /**
   * Retrieves a specific Problem document along with its populated solutions.
   * @param id - The ID of the problem to retrieve.
   * @returns A Promise that resolves to the Problem document with populated solutions.
   * @throws DatabaseException - If the problem cannot be retrieved.
   */
  async getProblemWithSolutions(id: Types.ObjectId): Promise<Problem> {
    await this.changeCounts(id, true, Counts.VIEWS);
    const problem = await this.problemRepository
      .getProblemWithSolutions(id)
      .catch((error) => {
        throw new DatabaseException(
          `Unable to load the problem : ${error.message}`,
        );
      });
    return problem;
  }

  /**
   * Deletes a specific Problem document from the database.
   * @param id - The ID of the problem to delete.
   * @returns A Promise that resolves to the deleted Problem document.
   * @throws NotFoundException - If the problem does not exist.
   * @throws UnauthorizedAccessException - If the user is not authorized to delete the problem.
   * @throws DatabaseException - If the problem cannot be deleted.
   */
  async deleteProblem(id: Types.ObjectId): Promise<Problem> {
    const userId: any = this.getUserID();

    const originalProblem = await this.problemRepository.getProblem(id);

    if (!originalProblem) {
      throw new NotFoundException(
        `Cannot delete problem with ID '${id}'. Problem not found.`,
      );
    }

    if (originalProblem.createdBy !== userId) {
      throw new UnauthorizedAccessException(
        'You are not authorized to update this problem.',
      );
    }

    const problem = await this.problemRepository
      .deleteProblem(id)
      .then(async (problem) => {
        await this.logService.createLog(
          {
            userId: userId,
            action: LogActions.DELETE,
            targetId: problem._id,
            targetModel: targetModels.PROBLEM,
          },
          () => this.rollbackProblem(problem),
        );
        return problem;
      })
      .catch(async (error) => {
        await this.logService.createLog({
          userId: userId,
          action: LogActions.DELETE,
          details: `Unable to delete the problem: ${error.message}`,
          isSuccess: false,
          targetModel: targetModels.PROBLEM,
        });
        throw new DatabaseException(
          `Unable to delete the problem: ${error.message}`,
        );
      });

    // need to change
    const deleteResult: DeleteResult =
      await this.solutionService.deleteAllSolution(id);

    return problem;
  }
}

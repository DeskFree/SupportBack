import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SolutionRepository } from './repository/solution.repository';
import { Solution } from './schemas/solution.schema';
import { CreateSolutionDto, UpdateSolutionDto, voteSolutionDto } from './dto';
import { DeleteResult, Types } from 'mongoose';
import { LogService } from '../log/log.service';
import { LogActions, targetModels, SolutionActions, VoteTypes } from '../enums';
import { DatabaseException } from 'src/exceptions';
import { ProblemService } from '../problem/problem.service';
import { UserValidatorUtil } from '../../utils';

/**
 * @class SolutionService
 * @description This service handles all operations related to solutions in the support desk project.
 * It provides methods to create, retrieve, update, delete, and vote on solutions. It also manages
 * logging and rollback operations in case of failures.
 *
 * @example
 * // Example usage of SolutionService
 * const solutionService = new SolutionService(solutionRepository, logService, problemService);
 *
 * // Create a new solution
 * const newSolution = await solutionService.createSolution(problemId, createSolutionDto);
 *
 * // Get a solution by ID
 * const solution = await solutionService.getSolution(solutionId);
 *
 * // Update a solution
 * const updatedSolution = await solutionService.updateSolution(solutionId, updateSolutionDto);
 *
 * // Delete a solution
 * const deletedSolution = await solutionService.deleteSolution(solutionId);
 *
 * // Vote on a solution
 * const votedSolution = await solutionService.voteSolution(solutionId, true);
 *
 * @see SolutionRepository
 * @see LogService
 * @see ProblemService
 */
@Injectable()
export class SolutionService {
  /**
   * @constructor
   * @param {SolutionRepository} solutionRepository - The repository for the solution model.
   * @param {LogService} logService - The service for logging operations.
   * @param {ProblemService} problemService - The service for problem operations.
   */
  constructor(
    private solutionRepository: SolutionRepository,
    private logService: LogService,

    @Inject(forwardRef(() => ProblemService))
    private problemService: ProblemService,
  ) {}

  /**
   * @method getSolution
   * @description Retrieves a solution by its ID from the database.
   *
   * @param {Types.ObjectId} id - The ID of the solution to retrieve.
   * @returns {Promise<Solution>} The solution retrieved from the database.
   * @throws {NotFoundException} If no solution is found for the given ID.
   * @throws {DatabaseException} If an error occurs while retrieving the solution.
   */
  private async getSolution(solutionId: Types.ObjectId): Promise<Solution> {
    return await this.solutionRepository
      .getSolution(solutionId)
      .then((solution) => {
        if (!solution) {
          throw new NotFoundException(
            `Solution with ID: ${solutionId} not found. Please verify the ID and try again.`,
          );
        }
        return solution;
      })
      .catch((error) => {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new DatabaseException(
          `An error occurred while retrieving the solution with ID: ${solutionId}. Error details: ${error.message}`,
        );
      });
  }

  /**
   * @method rollBackSolution
   * @description Rolls back a solution to its previous state in case of a failure.
   *
   * @param {Solution} solution - The solution to roll back.
   * @param {SolutionActions} actionToRollback - The action to roll back.
   * @returns {Promise<void>} A promise that resolves when the rollback operation is complete.
   * @throws {DatabaseException} If an error occurs while rolling back the solution.
   */
  private async rollBackSolution(
    solution: Solution,
    actionToRollback: SolutionActions,
  ): Promise<void> {
    await this.solutionRepository
      .rollBackSolution(solution, actionToRollback)
      .catch((rollbackError) => {
        console.error(
          `Rollback operation failed for the problem with ID: ${solution._id}.`,
          rollbackError,
        );
        throw new DatabaseException(
          `Failed to rollback changes for the problem with ID: ${solution._id}. Error details: ${rollbackError.message}`,
        );
      });
    return Promise.resolve();
  }

  /**
   * @method getUserID
   * @description Retrieves the ID of the user who is currently logged in.
   *
   * @returns {Types.ObjectId} The ID of the user who is currently logged in.
   */
  private getUserID(): Types.ObjectId {
    return new Types.ObjectId('6781080039c7df8d42da6ecd'); // Hardcoded for now as we don't have authentication yet
  }

  /**
   * @method createSolution
   * @description Creates a new solution in the database.
   *
   * @param {Types.ObjectId} id - The ID of the problem for which the solution is being created.
   * @param {CreateSolutionDto} newSolution - The details of the solution to create.
   * @returns {Promise<Solution>} The solution created in the database.
   * @throws {DatabaseException} If an error occurs while creating the solution.
   */
  async createSolution(
    problemId: Types.ObjectId,
    newSolution: CreateSolutionDto,
  ): Promise<Solution> {
    const userId = this.getUserID();
    const exist = await this.problemService.getProblem(problemId);
    newSolution.problemId = exist._id;

    newSolution.createdBy = userId;

    const solution = await this.solutionRepository
      .createSolution(newSolution)
      .then(async (solution) => {
        const isProblemUpdated = await this.problemService.addSolution(
          newSolution.problemId,
          solution._id,
        );
        if (isProblemUpdated) {
          const log = await this.logService.createLog(
            {
              userId: userId,
              action: LogActions.CREATE,
              targetModel: targetModels.SOLUTION,
              targetId: solution._id,
            },
            async () => {
              return await this.solutionRepository
                .deleteSolution(solution._id)
                .catch((rollbackError) => {
                  console.error(
                    `Rollback operation failed for the problem with ID: ${solution._id}.`,
                    rollbackError,
                  );
                  throw new DatabaseException(
                    `Failed to rollback changes for the problem with ID: ${solution._id}. Error details: ${rollbackError.message}`,
                  );
                });
            },
          );
          return solution;
        }
      })
      .catch(async (error) => {
        await this.logService.createLog({
          userId: userId,
          action: LogActions.CREATE,
          details: `Unable to create the solution: ${error.message}`,
          isSuccess: false,
          targetModel: targetModels.SOLUTION,
        });
        if (error instanceof DatabaseException) {
          throw error;
        }
        throw new DatabaseException(
          `Unable to create the solution: ${error.message}`,
        );
      });

    return solution;
  }

  /**
   * @method deleteAllSolution
   * @description Deletes all solutions associated with a problem from the database.
   *
   * @param problemId
   *
   * @throws {DatabaseException} If an error occurs while deleting the solutions.
   * @throws {NotFoundException} If no solutions are found for the given problem ID.
   * @throws {DatabaseException} If an error occurs while deleting the solutions.
   * @returns {Promise<DeleteResult>} The result of the deletion operation.
   *
   */
  async deleteAllSolution(problemId: Types.ObjectId): Promise<DeleteResult> {
    return await this.solutionRepository
      .deleteAllSolution(problemId)
      .catch((error) => {
        throw new DatabaseException(
          `Failed to delete all solutions associated with problem ID: ${problemId}. Error details: ${error.message}`,
        );
      });
  }

  /**
   * @method getSolutions
   * @description Retrieves all solutions associated with a problem from the database.
   *
   * @param id - The ID of the problem for which to retrieve solutions.
   * @returns {Promise<Solution[]>} The solutions retrieved from the database.
   * @throws {NotFoundException} If no solutions are found for the given problem ID.
   * @throws {DatabaseException} If an error occurs while retrieving the solutions.
   */
  async getSolutions(problemId: Types.ObjectId): Promise<Solution[]> {
    return await this.solutionRepository
      .getSolutions(problemId)
      .then((solutions) => {
        if (!solutions || solutions.length === 0) {
          throw new NotFoundException(
            `No solutions found for the problem with ID: ${problemId}. Please ensure the problem is correct and try again.`,
          );
        }
        return solutions;
      })
      .catch((error) => {
        if (
          error instanceof NotFoundException ||
          error instanceof DatabaseException
        ) {
          throw error;
        }
        throw new DatabaseException(
          `Failed to retrieve solutions for problem ID: ${problemId}. Error details: ${error.message}`,
        );
      });
  }

  /**
   * @method deleteSolution
   * @description Deletes a solution from the database.
   *
   * @param id - The ID of the solution to delete.
   * @returns {Promise<Solution>} The solution deleted from the database.
   * @throws {DatabaseException} If an error occurs while deleting the solution.
   * @throws {NotFoundException} If no solution is found for the given ID.
   * @throws {DatabaseException} If an error occurs while deleting the solution.
   */
  async deleteSolution(solutionId: Types.ObjectId): Promise<Solution> {
    const userId: Types.ObjectId = this.getUserID();
    const originalSolution = await this.getSolution(solutionId);
    const isUserValid: boolean = UserValidatorUtil.validateUser(
      userId,
      originalSolution.createdBy,
    );

    const solution = await this.solutionRepository
      .deleteSolution(solutionId)
      .then(async (solution) => {
        const isProblemUpdated = await this.problemService.removeSolution(
          originalSolution.problemId,
          solution._id,
        );
        if (isProblemUpdated) {
          const log = await this.logService.createLog(
            {
              userId: userId,
              action: LogActions.DELETE,
              targetModel: targetModels.SOLUTION,
              targetId: solution._id,
            },
            () =>
              this.rollBackSolution(originalSolution, SolutionActions.DELETE),
          );
          return solution;
        } else {
          this.rollBackSolution(solution, SolutionActions.DELETE);
          throw new DatabaseException(
            `Failed to delete solution for problem ID: ${solutionId}. The problem was not updated correctly.`,
          );
        }
      })
      .catch((error) => {
        this.logService.createLog({
          userId: userId,
          action: LogActions.DELETE,
          details: `Unable to delete the solution: ${error.message}`,
          isSuccess: false,
          targetModel: targetModels.SOLUTION,
        });
        if (error instanceof DatabaseException) {
          throw error;
        }
        throw new DatabaseException(
          `Failed to delete solution for problem ID: ${solutionId}. Error details: ${error.message}`,
        );
      });

    return solution;
  }

  /**
   * @method updateSolution
   * @description Updates a solution in the database.
   *
   * @param {Types.ObjectId} id - The ID of the solution to update.
   * @param {UpdateSolutionDto} updatedSolution - The new details of the solution.
   * @returns {Promise<Solution>} The updated solution.
   * @throws {DatabaseException} If an error occurs while updating the solution.
   * @throws {NotFoundException} If no solution is found for the given ID.
   */
  async updateSolution(
    solutionId: Types.ObjectId,
    updatedSolution: UpdateSolutionDto,
  ): Promise<Solution> {
    const userId: Types.ObjectId = this.getUserID();
    const originalSolution = await this.getSolution(solutionId);
    UserValidatorUtil.validateUser(userId, originalSolution.createdBy);

    const solution: Solution = await this.solutionRepository
      .updateSolution(solutionId, updatedSolution)
      .then(async (solution) => {
        const log = await this.logService.createLog(
          {
            userId: userId,
            action: LogActions.UPDATE,
            targetModel: targetModels.SOLUTION,
            targetId: solution._id,
          },
          () => this.rollBackSolution(originalSolution, SolutionActions.UPDATE),
        );
        return solution;
      })
      .catch((error) => {
        this.logService.createLog({
          userId: userId,
          action: LogActions.UPDATE,
          details: `Unable to update the solution: ${error.message}`,
          isSuccess: false,
          targetModel: targetModels.SOLUTION,
        });
        throw new DatabaseException(
          `Failed to update solution for problem ID: ${solutionId}. Error details: ${error.message}`,
        );
      });
    return solution;
  }

  /**
   * Casts a vote on a solution.
   *
   * @param {Types.ObjectId} solutionId - The ID of the solution to be voted on.
   * @param {boolean} isUpVote - Indicates whether the vote is an upvote (true) or a downvote (false).
   * @returns {Promise<Solution>} - A promise that resolves to the updated solution after the vote has been cast.
   * @throws {DatabaseException} - Throws an exception if the vote operation fails.
   *
   * This method retrieves the current user's ID and the original solution based on the provided solution ID.
   * It then determines the type of vote (upvote or downvote) and updates the solution's vote count accordingly.
   * The method logs the voting action and handles any errors that occur during the voting process.
   */
  // async voteSolution(
  //   solutionId: Types.ObjectId,
  //   isUpVote: boolean,
  // ): Promise<Solution> {
  //   const userId: Types.ObjectId = this.getUserID();

  //   const originalSolution = await this.getSolution(solutionId);

  //   const vote = isUpVote
  //     ? originalSolution.upVotes + 1
  //     : originalSolution.downVotes + 1;

  //   const votedDetails: voteSolutionDto = {
  //     voteType: isUpVote ? VoteTypes.UPVOTES : VoteTypes.DOWNVOTES,
  //     solutionId,
  //     vote,
  //   };

  //   const solution = await this.solutionRepository
  //     .updateVote(votedDetails)
  //     .then(async (solution) => {
  //       const log = await this.logService.createLog(
  //         {
  //           userId: userId,
  //           action: LogActions.VOTE,
  //           targetModel: targetModels.SOLUTION,
  //           targetId: solution._id,
  //         },
  //         () => this.rollBackSolution(originalSolution, SolutionActions.VOTE),
  //       );
  //       return solution;
  //     })
  //     .catch((error) => {
  //       this.logService.createLog({
  //         userId: userId,
  //         action: LogActions.VOTE,
  //         details: `Unable to vote the solution: ${error.message}`,
  //         isSuccess: false,
  //         targetModel: targetModels.SOLUTION,
  //       });
  //       throw new DatabaseException(
  //         `Failed to vote solution for problem ID: ${solutionId}. Error details: ${error.message}`,
  //       );
  //     });

  //   return solution;
  // }

  /**
   * Votes on a solution by either upvoting or downvoting it.
   *
   * @param {Types.ObjectId} solutionId - The ID of the solution to vote on.
   * @param {boolean} isUpVote - A boolean indicating whether the vote is an upvote (true) or a downvote (false).
   * @returns {Promise<boolean>} - A promise that resolves to true if the vote was successful, otherwise throws an exception.
   * @throws {NotFoundException} - If the solution with the given ID is not found.
   * @throws {DatabaseException} - If there is an issue processing the vote.
   */
  async voteSolution(
    solutionId: Types.ObjectId,
    isUpVote: boolean,
  ): Promise<boolean> {
    const solution = await this.solutionRepository.getSolution(solutionId);
    if (!solution) {
      throw new NotFoundException(
        `Solution with ID: ${solutionId} not found. Please verify the ID and try again.`,
      );
    }

    const query = isUpVote
      ? { upVotes: solution.upVotes + 1 }
      : { downVotes: solution.downVotes + 1 };

    return await this.solutionRepository
      .voteSolution(solutionId, solution)
      .then((result) => {
        if (!result) {
          throw new NotFoundException(
            `Failed to vote solution with ID '${solutionId}'. The solution may not exist or there was an issue processing the vote.`,
          );
        }
        return true;
      })
      .catch((error) => {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new DatabaseException(
          `Failed to vote solution with ID '${solutionId}'. The solution may not exist or there was an issue processing the vote.`,
        );
      });

    //   if (isUpVote) {
    //     return await this.solutionRepository.upVote(solutionId).then((result) => {
    //       if (!result) {
    //         throw new DatabaseException(
    //           `Failed to upvote solution with ID '${solutionId}'. The solution may not exist or there was an issue processing the up vote.`,
    //         );
    //       }
    //       return true;
    //     });
    //   } else {
    //     return await this.solutionRepository
    //       .downVote(solutionId)
    //       .then((result) => {
    //         if (!result) {
    //           throw new DatabaseException(
    //             `Failed to downvote solution with ID '${solutionId}'. The solution may not exist or there was an issue processing the down vote.`,
    //           );
    //         }
    //         return true;
    //       });
    //   }
    //   return Promise.resolve(true);
  }
}

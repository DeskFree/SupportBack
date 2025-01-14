import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SolutionRepository } from './repository/solution.repository';
import { Solution } from './schemas/solution.schema';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { DeleteResult, Types } from 'mongoose';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { LogService } from '../log/log.service';
import { LogActions } from '../log/enum/log-actions.enum';
import { targetModels } from '../log/enum/log-models.enum';
import { DatabaseException } from 'src/exceptions/database.exception';
import { ProblemService } from '../problem/problem.service';
import { UserValidatorUtil } from '../../utils/user-validator.util';
import { error } from 'console';
import { voteSolutionDto } from './dto/vote-solution.dto';
import { VoteTypes } from './enum/vote-types.enum';
import { SolutionActions } from './enum/solution-Actions.enum';

@Injectable()
export class SolutionService {
  constructor(
    private solutionRepository: SolutionRepository,
    private logService: LogService,

    @Inject(forwardRef(() => ProblemService))
    private problemService: ProblemService,
  ) {}

  private async getSolution(id: Types.ObjectId): Promise<Solution> {
    return await this.solutionRepository
      .getSolution(id)
      .then((solution) => {
        if (!solution) {
          throw new NotFoundException(
            `No solution found for the problem with ID: ${id}. Please ensure the problem is correct and try again.`,
          );
        }
        return solution;
      })
      .catch((error) => {
        throw new DatabaseException(
          `Failed to retrieve solution for problem ID: ${id}. Error details: ${error.message}`,
        );
      });
  }

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

  private getUserID(): Types.ObjectId {
    return new Types.ObjectId('6781080039c7df8d42da6ecd'); // Hardcoded for now as we don't have authentication yet
  }

  async createSolution(
    id: Types.ObjectId,
    newSolution: CreateSolutionDto,
  ): Promise<Solution> {
    const userId = this.getUserID();
    const exist = await this.problemService.getProblem(id);

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
        throw new DatabaseException(
          `Unable to create the solution: ${error.message}`,
        );
      });

    return solution;
  }

  async deleteAllSolution(problemId: Types.ObjectId): Promise<DeleteResult> {
    return await this.solutionRepository
      .deleteAllSolution(problemId)
      .catch((error) => {
        throw new DatabaseException(
          `Failed to delete all solutions associated with problem ID: ${problemId}. Error details: ${error.message}`,
        );
      });
  }

  async getSolutions(id: Types.ObjectId): Promise<Solution[]> {
    return await this.solutionRepository
      .getSolutions(id)
      .then((solutions) => {
        if (solutions.length === 0) {
          throw new NotFoundException(
            `No solutions found for the problem with ID: ${id}. Please ensure the problem is correct and try again.`,
          );
        }
        return solutions;
      })
      .catch((error) => {
        throw new DatabaseException(
          `Failed to retrieve solutions for problem ID: ${id}. Error details: ${error.message}`,
        );
      });
  }

  async deleteSolution(id: Types.ObjectId): Promise<Solution> {
    const userId: Types.ObjectId = this.getUserID();
    const originalSolution = await this.getSolution(id);
    const isUserValid: boolean = UserValidatorUtil.validateUser(
      userId,
      originalSolution.createdBy,
    );

    const solution = await this.solutionRepository
      .deleteSolution(id)
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
            `Failed to delete solution for problem ID: ${id}. The problem was not updated correctly.`,
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
        throw new DatabaseException(
          `Failed to delete solution for problem ID: ${id}. Error details: ${error.message}`,
        );
      });

    return solution;
  }

  async updateSolution(
    id: Types.ObjectId,
    updatedSolution: UpdateSolutionDto,
  ): Promise<Solution> {
    const userId: Types.ObjectId = this.getUserID();
    const originalSolution = await this.getSolution(id);
    UserValidatorUtil.validateUser(userId, originalSolution.createdBy);

    const solution: Solution = await this.solutionRepository
      .updateSolutions(id, updatedSolution)
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
          `Failed to update solution for problem ID: ${id}. Error details: ${error.message}`,
        );
      });
    return solution;
  }

  async voteSolution(
    solutionId: Types.ObjectId,
    isUpVote: boolean,
  ): Promise<Solution> {
    const userId: Types.ObjectId = this.getUserID();

    const originalSolution = await this.getSolution(solutionId);

    const vote = isUpVote
      ? originalSolution.upVotes + 1
      : originalSolution.downVotes + 1;

    const votedDetails: voteSolutionDto = {
      voteType: isUpVote ? VoteTypes.UPVOTES : VoteTypes.DOWNVOTES,
      solutionId,
      vote,
    };

    const solution = await this.solutionRepository
      .updateVote(votedDetails)
      .then(async (solution) => {
        const log = await this.logService.createLog(
          {
            userId: userId,
            action: LogActions.VOTE,
            targetModel: targetModels.SOLUTION,
            targetId: solution._id,
          },
          () => this.rollBackSolution(originalSolution, SolutionActions.VOTE),
        );
        return solution;
      })
      .catch((error) => {
        this.logService.createLog({
          userId: userId,
          action: LogActions.VOTE,
          details: `Unable to vote the solution: ${error.message}`,
          isSuccess: false,
          targetModel: targetModels.SOLUTION,
        });
        throw new DatabaseException(
          `Failed to vote solution for problem ID: ${solutionId}. Error details: ${error.message}`,
        );
      });

    return solution;
  }
}

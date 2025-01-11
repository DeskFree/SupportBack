import {
  BadRequestException,
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
import { LogFailureException } from '../../exceptions/log-failure.exception';
import { RateLimitService } from '../rate-limit/rate-limit.service';
import { Counts } from './enums/counts.enum';
import { UpdateProblemCountsDto } from './dto/update-problem-counts.dto';
import { TooManyRequestsException } from 'src/exceptions/too-many-requests-exception';
import { DatabaseException } from 'src/exceptions/database.exception';
import { UnauthorizedAccessException } from 'src/exceptions/unauthorized-access.exception';

@Injectable()
export class ProblemService {
  constructor(
    private problemRepository: ProblemRepository,
    private readonly logService: LogService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  

  private changeCounts(
    problemId: string,
    isIncrease: boolean,
    countType: Counts,
  ): Promise <boolean> {
    let count: number;
    const problem = this.getProblem(problemId)
      .then(async (problem) => {
        const multiplier = isIncrease ? 1 : -1;
        switch (countType) {
          case Counts.VOTES:
            count = problem.votes + multiplier;
            break;
          case Counts.VIEWS:
            count = problem.views + multiplier;
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
        const updatedProblem = await this.problemRepository.updateCounts(newCount).catch((error) => {
          const errorMsg = `Failed to ${isIncrease ? 'increase' : 'decrease'} the ${countType} count : ${error.message}`;
          console.log(errorMsg);
          throw new BadRequestException(errorMsg);
        });
        return !!updatedProblem;
      })
      .catch((error) => {
        const errorMsg = `Failed to fetch the problem with ID '${problemId}' from the database. Error details: ${error.message}.`;
        console.log(errorMsg);
        throw new DatabaseException(errorMsg);
      });
      return problem;
  }

  private async getProblem(id: string): Promise<Problem> {
    const problem = await this.problemRepository.getProblem(id);
    return problem;
  }

  private getProblemId(problem: Problem): any {
    return JSON.parse(JSON.stringify(problem)).id;
  }

  private getUserID(): string {
    return '6781080039c7df8d42da6ecd';// Hardcoded for now as we don't have authentication yet
  }

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
        await this.logService
          .createLog({
            userId: problem.createdBy,
            action: LogActions.CREATE,
            targetId: this.getProblemId(problem),
            targetModel: targetModels.PROBLEM,
          })
          .catch(async (error) => {
            await this.problemRepository
              .deleteProblem(this.getProblemId(problem))
              .catch((rollbackError) => {
                console.error(
                  `Rollback operation failed for the problem with ID: ${this.getProblemId(problem)}.`,
                  rollbackError,
                );
              });
            throw new LogFailureException(
              `Failed to record the creation of the problem. Error details: ${error.message}.`,
            );
          });
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

  async updateProblem(
    id: string,
    updatedProblem: UpdateProblemDto,
  ): Promise<Problem> {
    updatedProblem.id = id;

    const userId: any = this.getUserID();

    const originalProblem = await this.problemRepository.getProblem(
      updatedProblem.id,
    );

    if (originalProblem.createdBy !== userId) {
      throw new UnauthorizedAccessException(
        'You are not authorized to update this problem.',
      );
    }

    const problem = await this.problemRepository
      .updateProblem(updatedProblem)
      .then(async (problem) => {
        await this.logService
          .createLog({
            userId: userId,
            action: LogActions.UPDATE,
            targetId: this.getProblemId(problem),
            targetModel: targetModels.PROBLEM,
          })
          .catch(async (error) => {
            await this.problemRepository
              .rollBackProblem(
                originalProblem,
                this.getProblemId(originalProblem),
              )
              .catch((rollbackError) => {
                console.error(
                  `Rollback operation failed for the problem with ID: ${this.getProblemId(problem)}.`,
                  rollbackError,
                );
              });
          });
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

  async vote(id: string,isUpVote:boolean): Promise<boolean> {
    return this.changeCounts(id, isUpVote, Counts.VOTES);
  }

  async addSolution(id: string, solutionId: string): Promise<boolean> {
    const problem = this.problemRepository
      .addSolution(id, solutionId)
      .catch((error) => {
        const errMsg = `Unable to add solution to the problem: ${error.message}`;
        console.error(errMsg);
        throw new DatabaseException(errMsg);
      });
    this.changeCounts(id, true, Counts.SOLUTION_COUNT);
    return !!problem;
  }

  async removeSolution(id: string, solutionId: string): Promise<boolean> {
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

  async getProblemWithSolutions(id: string): Promise<Problem> {
    const problem = await this.problemRepository.getProblemWithSolutions(id).catch((error) => {
      throw new DatabaseException(`Unable to load the problem : ${error.message}`);
    })
    this.changeCounts(id, true, Counts.VIEWS);
    return problem;
  }

  async deleteProblem(id: string): Promise<Problem> {
    const userId: any = this.getUserID();

    const originalProblem = await this.problemRepository.getProblem(id);

    if(!originalProblem) {
      throw new NotFoundException( `Cannot delete problem with ID '${id}'. Problem not found.`);
    }

    if (originalProblem.createdBy !== userId) {
      throw new UnauthorizedAccessException(
        'You are not authorized to update this problem.',
      );
    }

    const problem = await this.problemRepository
      .deleteProblem(id)
      .then(async (problem) => {
        await this.logService
          .createLog({
            userId: userId,
            action: LogActions.DELETE,
            targetId: this.getProblemId(problem),
            targetModel: targetModels.PROBLEM,
          })
          .catch(async (error) => {
            this.problemRepository
              .rollBackProblem(problem)
              .catch((rollbackError) => {
                console.error(
                  `Rollback operation failed for the problem with ID: ${this.getProblemId(problem)}.`,
                  rollbackError,
                );
              });
          });
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

    // need to delete all solutions related to this problem

    return problem;
  }
}

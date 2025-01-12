import { Injectable, NotFoundException } from '@nestjs/common';
import { SolutionRepository } from './repository/solution.repository';
import { Solution } from './schemas/solution.schema';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { Types } from 'mongoose';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { ProblemService } from '../problem/problem.service';
import { LogService } from '../log/log.service';
import { LogActions } from '../log/enum/log-actions.enum';
import { targetModels } from '../log/enum/log-models.enum';
import { DatabaseException } from 'src/exceptions/database.exception';
import { error } from 'console';

@Injectable()
export class SolutionService {
  constructor(
    private solutionRepository: SolutionRepository,
    private problemService: ProblemService,
    private logService: LogService,
  ) {}

  private async rollBackSolution(solution: Solution): Promise<void> {
    await this.solutionRepository
      .rollBackSolution(solution)
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

  async getSolutions(id: string): Promise<Solution[]> {
    return await this.solutionRepository.getSolutions(id);
  }

  async deleteSolution(id: Types.ObjectId): Promise<Solution> {
    return await this.solutionRepository.deleteSolution(id);
  }

  async updateSolution(
    id: string,
    updatedSolution: UpdateSolutionDto,
  ): Promise<Solution> {
    return await this.solutionRepository.updateSolutions(id, updatedSolution);
  }
}

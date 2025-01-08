import { Injectable } from '@nestjs/common';
import { SearchProblemDto } from './dto/search-problem.dto';
import { Problem } from './schemas/problem.schema';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.Dto';
import { ProblemRepository } from './repository/problem.repository';
import { LogService } from '../log/log.service';
import { LogActions } from '../log/enum/log-actions.enum';
import { targetModels } from '../log/enum/log-models.enum';

@Injectable()
export class ProblemService {
  constructor(
    private problemRepository: ProblemRepository,
    private readonly logService: LogService,
  ) {}

  async createProblem(newProblem: CreateProblemDto): Promise<Problem> {
    newProblem.createdBy = 'AD';

    try {
      const problem = await this.problemRepository.createProblem(newProblem);

      const log = await this.logService.createLog({
        userId: problem.createdBy,
        action: LogActions.CREATE,
        details: `Problem created with ID: ${JSON.parse(JSON.stringify(problem)).id}`,
        targetId: JSON.parse(JSON.stringify(problem)).id,
        targetModel: targetModels.PROBLEM,
      });

      return problem;

    } catch (error) {
      throw new Error(`Failed to create problem: ${error.message}`);
    }
  }

  async updateProblem(updatedProblem: UpdateProblemDto): Promise<Problem> {
    const problems = await this.problemRepository.updateProblem(updatedProblem);
    return problems;
  }

  async searchProblem(searchProblemDto: SearchProblemDto): Promise<Problem[]> {
    const { title, status } = searchProblemDto;
    let filter: any = {};
    if (title) {
      filter.title = title;
    } else if (status) {
      filter.status = status.toLocaleUpperCase();
    }
    let problems = await this.problemRepository.searchProblem(filter);
    return problems;
  }

  async getAllProblem(): Promise<Problem[]> {
    let problems = await this.problemRepository.getAllProblems();
    return problems;
  }
  async getProblem(id: string): Promise<Problem> {
    let problems = await this.problemRepository.getProgram(id);
    return problems;
  }

  async deleteProblem(id: string): Promise<Problem> {
    const problem = await this.problemRepository.deleteProblem(id);
    return problem;
  }
}

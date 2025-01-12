import { Injectable, NotFoundException } from '@nestjs/common';
import { SolutionRepository } from './repository/solution.repository';
import { Solution } from './schemas/solution.schema';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { Types } from 'mongoose';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { Problem } from '../problem/schemas/problem.schema';
import { ProblemRepository } from '../problem/repository/problem.repository';

@Injectable()
export class SolutionService {
  constructor(
    private solutionRepository: SolutionRepository,
    private problemRepository: ProblemRepository,
  ) {}

  async createSolution(
    id: Types.ObjectId,
    newSolution: CreateSolutionDto,
  ): Promise<Solution> {
    const userId = '';
    const exist = this.problemRepository.getProblem(id);
    if (!exist) {
      throw new NotFoundException();
    }

    newSolution.problemId = id;
    const problem = await this.solutionRepository
      .createSolution(newSolution)
      .then((problem) => {
        return problem;
      });

    return problem;
  }

  async getSolutions(id: string): Promise<Solution[]> {
    return await this.solutionRepository.getSolutions(id);
  }

  async deleteSolution(id: string): Promise<Solution> {
    return await this.solutionRepository.deleteSolution(id);
  }

  async updateSolution(
    id: string,
    updatedSolution: UpdateSolutionDto,
  ): Promise<Solution> {
    return await this.solutionRepository.updateSolutions(id, updatedSolution);
  }
}

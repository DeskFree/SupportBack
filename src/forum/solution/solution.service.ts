import { Injectable } from '@nestjs/common';
import { SolutionRepository } from './repository/solution.repository';
import { Solution } from './schemas/solution.schema';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { Types } from 'mongoose';
import { UpdateSolutionDto } from './dto/update-solution.dto';

@Injectable()
export class SolutionService {
  constructor(private solutionRepository: SolutionRepository) {}

  async createSolution(
    id: Types.ObjectId,
    newSolution: CreateSolutionDto,
  ): Promise<Solution> {
    newSolution.problemId = id
    return await this.solutionRepository.createSolution(newSolution);
  }

  async getSolutions(id: string): Promise<Solution[]> {
    return await this.solutionRepository.getSolutions(id);
  }

  async deleteSolution(id: string): Promise<Solution> {
    return await this.solutionRepository.deleteSolution(id);
  }

  async updateSolution(id: string,updatedSolution:UpdateSolutionDto): Promise<Solution> {
    return await this.solutionRepository.updateSolutions(id,updatedSolution);
  }
}

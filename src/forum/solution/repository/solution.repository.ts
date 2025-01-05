import { Injectable } from '@nestjs/common';
import { Solution, SolutionDocument } from '../schemas/solution.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSolutionDto } from '../dto/create-solution.dto';
import { UpdateSolutionDto } from '../dto/update-solution.dto';

@Injectable()
export class SolutionRepository {
  constructor(
    @InjectModel(Solution.name) private solutionModel: Model<SolutionDocument>,
  ) {}

  async createSolution(newSolution: CreateSolutionDto): Promise<Solution> {
    return await new this.solutionModel(newSolution).save();
  }

  async getSolutions(id: string): Promise<Solution[]> {
    return await this.solutionModel.find({ problemId: id });
  }

  async deleteSolution(id: string): Promise<Solution> {
    return await this.solutionModel.findByIdAndDelete(id);
  }

  async updateSolutions(id: string,updatedSolution:UpdateSolutionDto): Promise<Solution> {
    return await this.solutionModel.findByIdAndUpdate(id,updatedSolution,
      { returnDocument: 'after' });
  }
}

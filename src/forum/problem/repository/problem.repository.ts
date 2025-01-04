import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Problem, ProblemDocument } from '../schemas/problem.schema';
import { Model } from 'mongoose';
import { CreateProblemDto } from '../dtos/create-problem.dto';
import { UpdateProblemDto } from '../dtos/update-problem.Dto';

@Injectable()
export class ProblemRepository {
  constructor(
    @InjectModel(Problem.name) private problemModel: Model<ProblemDocument>,
  ) {}
  async createProblem(newProblem: CreateProblemDto): Promise<Problem> {
    return await new this.problemModel(newProblem).save();
  }
  async getAllProblems(): Promise<Problem[]> {
    return await this.problemModel.find();
  }

  async updateProblem(updatedProblem: UpdateProblemDto): Promise<Problem> {
    return await this.problemModel.findByIdAndUpdate(
      updatedProblem.id,
      updatedProblem,
      { returnDocument: 'after' },
    );
  }
  async deleteProblem(id:string): Promise<Problem> {
    return await this.problemModel.findByIdAndDelete(id);
  }
}

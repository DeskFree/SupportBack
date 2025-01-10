import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Problem, ProblemDocument } from '../schemas/problem.schema';
import { Model } from 'mongoose';
import { CreateProblemDto } from '../dto/create-problem.dto';
import { UpdateProblemDto } from '../dto/update-problem.Dto';

@Injectable()
export class ProblemRepository {

  constructor(
    @InjectModel(Problem.name) private problemModel: Model<ProblemDocument>,
  ) {}

  async createProblem(newProblem: CreateProblemDto): Promise<Problem> {
    return await new this.problemModel(newProblem).save();
  }

  async getAllProblems(): Promise<Problem[]> {
    return await this.problemModel.find().exec();
  }

  async getProgram(id: string): Promise<Problem> {
    return await this.problemModel.findById(id).exec();
  }

  async updateProblem(updatedProblem: UpdateProblemDto): Promise<Problem> {
    return await this.problemModel.findByIdAndUpdate(
      updatedProblem.id,
      updatedProblem,
      { returnDocument: 'after' },
    ).exec();
  }

  async deleteProblem(id: string): Promise<Problem> {
    return await this.problemModel.findByIdAndDelete(id).exec();
  }

  async searchProblem(filter: Record<string, any>): Promise<Problem[]> {
    return await this.problemModel.find(filter).exec();
  }
  
}

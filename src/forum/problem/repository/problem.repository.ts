import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Problem, ProblemDocument } from '../schemas/problem.schema';
import { Model } from 'mongoose';
import { CreateProblemDto } from '../dto/create-problem.dto';
import { UpdateProblemDto } from '../dto/update-problem.Dto';
import { UpdateProblemCountsDto } from '../dto/update-problem-counts.dto';

@Injectable()
export class ProblemRepository {
  constructor(
    @InjectModel(Problem.name) private problemModel: Model<ProblemDocument>,
  ) {}

  async createProblem(newProblem: CreateProblemDto): Promise<Problem> {
    return await new this.problemModel(newProblem).save();
  }

  async rollBackProblem(newProblem: Problem): Promise<Problem> {
    return await new this.problemModel(newProblem).save();
  }

  async getAllProblems(): Promise<Problem[]> {
    return await this.problemModel.find().exec();
  }

  async getProblem(id: string): Promise<Problem> {
    return await this.problemModel.findById(id).exec();
  }

  async addSolution(problemId: string, solutionId: string):Promise <void> {
    await this.problemModel.findByIdAndUpdate(
      problemId,
      { $push: { solutions: solutionId } },
      { new: true },
    );
  }
  async removeSolution(problemId: string, solutionId: string):Promise <void> {
    await this.problemModel.findByIdAndUpdate(
      problemId,
      { $pull: { solutions: solutionId } },
      { new: true },
    );
  }

  async getProblemWithSolutions(id: string): Promise<Problem> {
    return await this.problemModel.findById(id).populate('solutions').exec();
  }

  async updateProblem(updatedProblem: UpdateProblemDto): Promise<Problem> {
    return await this.problemModel
      .findByIdAndUpdate(updatedProblem.id, updatedProblem, {
        returnDocument: 'after',
      })
      .exec();
  }

  async updateCounts(newCount: UpdateProblemCountsDto): Promise<Problem> {
    const query = { [newCount.countType] : newCount.count }
    return await this.problemModel
      .findByIdAndUpdate(newCount.problemId, {
        returnDocument: 'after',
      })
      .exec();
  }

  async deleteProblem(id: string): Promise<Problem> {
    return await this.problemModel.findByIdAndDelete(id).exec();
  }

  async searchProblem(filter: Record<string, any>): Promise<Problem[]> {
    return await this.problemModel.find(filter).exec();
  }
}

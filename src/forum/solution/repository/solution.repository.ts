import { Injectable } from '@nestjs/common';
import { Solution, SolutionDocument } from '../schemas/solution.schema';
import { DeleteResult, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSolutionDto } from '../dto/create-solution.dto';
import { UpdateSolutionDto } from '../dto/update-solution.dto';
import { voteSolutionDto } from '../dto/vote-solution.dto';

@Injectable()
export class SolutionRepository {
  constructor(
    @InjectModel(Solution.name) private solutionModel: Model<SolutionDocument>,
  ) {}

  async rollBackSolution(newSolution: Solution): Promise<Solution> {
    if (!newSolution._id) {
      return await new this.solutionModel(newSolution).save();
    }
    return await this.solutionModel
      .findByIdAndUpdate(newSolution._id, newSolution, {
        returnDocument: 'after',
      })
      .exec();
  }

  async createSolution(newSolution: CreateSolutionDto): Promise<Solution> {
    return await new this.solutionModel(newSolution).save();
  }

  async getSolutions(id: Types.ObjectId): Promise<Solution[]> {
    return await this.solutionModel.find({ problemId: id }).exec();
  }

  async getSolution(id: Types.ObjectId): Promise<Solution> {
    return await this.solutionModel.findById(id).exec();
  }

  async deleteSolution(id: Types.ObjectId): Promise<Solution> {
    return await this.solutionModel.findByIdAndDelete(id).exec();
  }

  async deleteAllSolution(problemId: Types.ObjectId): Promise<DeleteResult> {
    return await this.solutionModel.deleteMany({ problemId }).exec();
  }

  async updateVote(newCount: voteSolutionDto): Promise<Solution> {
    const { solutionId, voteType, vote } = newCount;

    const update = { [voteType]: vote };

    return await this.solutionModel
      .findByIdAndUpdate(solutionId, { $set: update }, { new: true })
      .exec();
  }

  async updateSolutions(
    id: Types.ObjectId,
    updatedSolution: UpdateSolutionDto,
  ): Promise<Solution> {
    return await this.solutionModel
      .findByIdAndUpdate(id, updatedSolution, { returnDocument: 'after' })
      .exec();
  }
}

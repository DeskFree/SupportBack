import { Injectable } from '@nestjs/common';
import { Solution, SolutionDocument } from '../schemas';
import { DeleteResult, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SolutionActions } from '../../enums';
import { DatabaseRollBackException } from 'src/exceptions';
import { UpdateSolutionDto, voteSolutionDto, CreateSolutionDto } from '../dto';

@Injectable()
export class SolutionRepository {
  constructor(
    @InjectModel(Solution.name) private solutionModel: Model<SolutionDocument>,
  ) {}

  async rollBackSolution(
    newSolution: Solution,
    actionToRollback: SolutionActions,
  ): Promise<Solution> {
    switch (actionToRollback) {
      case SolutionActions.CREATE:
        return await this.solutionModel.findByIdAndDelete(newSolution._id);
      case SolutionActions.UPDATE:
        return await this.solutionModel
          .findByIdAndUpdate(newSolution._id, newSolution)
          .exec();
      case SolutionActions.DELETE:
        return await new this.solutionModel(newSolution).save();
      case SolutionActions.VOTE:
        return await this.solutionModel
          .findByIdAndUpdate(newSolution._id, newSolution)
          .exec();
      default:
        throw new DatabaseRollBackException(
          `Invalid rollback action: ${actionToRollback}`,
        );
    }
  }

  async createSolution(newSolution: CreateSolutionDto): Promise<Solution> {
    return await new this.solutionModel(newSolution).save();
  }

  async getSolutions(problemId: Types.ObjectId): Promise<Solution[]> {
    return await this.solutionModel.find({ problemId }).exec();
  }

  async getSolution(solutionId: Types.ObjectId): Promise<Solution> {
    return await this.solutionModel.findById(solutionId).exec();
  }

  async deleteSolution(solutionId: Types.ObjectId): Promise<Solution> {
    return await this.solutionModel.findByIdAndDelete(solutionId).exec();
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

  async updateSolution(
    solutionId: Types.ObjectId,
    updatedSolution: UpdateSolutionDto,
  ): Promise<Solution> {
    return await this.solutionModel
      .findByIdAndUpdate(solutionId, updatedSolution, {
        returnDocument: 'after',
      })
      .exec();
  }

  async voteSolution(
    solutionId: Types.ObjectId,
    query: any,
  ): Promise<Solution> {
    return await this.solutionModel
      .findByIdAndUpdate(solutionId, query, {
        returnDocument: 'after',
      })
      .exec();
  }
}

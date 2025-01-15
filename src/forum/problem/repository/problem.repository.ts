import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Problem, ProblemDocument } from '../schemas/problem.schema';
import { Model, Types } from 'mongoose';
import { CreateProblemDto } from '../dto/create-problem.dto';
import { UpdateProblemDto } from '../dto/update-problem.Dto';
import { UpdateProblemCountsDto } from '../dto/update-problem-counts.dto';
import { ProblemActions } from '../enums/problem-actions.enum';

/**
 * Repository class for managing Problem entities in the database.
 * This class provides methods to perform CRUD operations and other related actions on Problem documents.
 * This class is used to encapsulate all the database operations related to Problem entities.because it is a good practice to separate the database operations from the business logic.
 * it helps to change the database or the ORM library without affecting the business logic.
 */
@Injectable()
export class ProblemRepository {
  /**
   * Constructs the ProblemRepository.
   * @param problemModel - The Mongoose model for the Problem entity.
   * The @InjectModel() decorator is used to inject the Problem model into the repository.
   */
  constructor(
    @InjectModel(Problem.name) private problemModel: Model<ProblemDocument>,
  ) {}

  /**
   * Creates a new Problem document in the database.
   * @param newProblem - The data transfer object containing the details of the problem to be created.
   * @returns A Promise that resolves to the created Problem document.
   */
  async createProblem(newProblem: CreateProblemDto): Promise<Problem> {
    return await new this.problemModel(newProblem).save();
  }

  /**
   * Rolls back a problem creation or update operation.
   * If an ID is provided, it updates the existing problem; otherwise, it creates a new problem.
   * This method is used to roll back a problem creation or update operation in case of an error.
   * @param newProblem - The problem data to be rolled back.
   * @param id - The ID of the problem to be updated (optional).
   * @returns A Promise that resolves to the rolled back Problem document.
   */
  async rollBackProblem(
    originalProblem: Problem,
    action: ProblemActions,
  ): Promise<Problem> {
    switch (action) {
      case ProblemActions.CREATE_PROBLEM:
        return await this.problemModel.findByIdAndDelete(originalProblem._id);
      case ProblemActions.UPDATE_PROBLEM:
        return await this.problemModel
          .findByIdAndUpdate(originalProblem._id, originalProblem)
          .exec();
      case ProblemActions.DELETE_PROBLEM:
        return await new this.problemModel(originalProblem).save();
      case ProblemActions.VIEW_PROBLEM:
        return await this.problemModel
          .findByIdAndUpdate(originalProblem._id, originalProblem)
          .exec();
      case ProblemActions.VOTE:
        return await this.problemModel
          .findByIdAndUpdate(originalProblem._id, originalProblem)
          .exec();
      default:
        throw new Error(`Invalid rollback action: ${action}`);
    }
  }

  /**
   * Retrieves all Problem documents from the database.
   * @returns A Promise that resolves to an array of Problem documents.
   */
  async getAllProblems(): Promise<Problem[]> {
    return await this.problemModel.find().exec();
  }

  /**
   * Retrieves a Problem document by its ID from the database.
   * @param id - The ID of the Problem document.
   * @returns A Promise that resolves to the retrieved Problem document.
   */
  async getProblem(id: Types.ObjectId): Promise<Problem> {
    return await this.problemModel.findById(id).exec();
  }

  /**
   * Adds a solution to a problem.
   * @param problemId - The ID of the problem to which the solution is to be added.
   * @param solutionId - The ID of the solution to be added to the problem.
   * @returns A Promise that resolves to void.
   */
  async addSolution(
    problemId: Types.ObjectId,
    solutionId: Types.ObjectId,
  ): Promise<void> {
    await this.problemModel.findByIdAndUpdate(
      problemId,
      { $push: { solutions: solutionId } },
      { new: true },
    );
  }

  /**
   * Removes a solution from a problem.
   * @param problemId - The ID of the problem from which the solution is to be removed.
   * @param solutionId - The ID of the solution to be removed from the problem.
   * @returns A Promise that resolves to void
   */
  async removeSolution(
    problemId: Types.ObjectId,
    solutionId: Types.ObjectId,
  ): Promise<void> {
    await this.problemModel.findByIdAndUpdate(
      problemId,
      { $pull: { solutions: solutionId } },
      { new: true },
    );
  }

  /**
   * Retrieves a Problem document with its solutions from the database.
   * @param id - The ID of the Problem document.
   * @returns A Promise that resolves to the retrieved Problem document with its solutions.
   */
  async getProblemWithSolutions(id: Types.ObjectId): Promise<Problem> {
    return await this.problemModel.findById(id).populate('solutions').exec();
  }

  /**
   * Updates a Problem document in the database.
   * @param updatedProblem - The data transfer object containing the updated details of the problem.
   * @returns A Promise that resolves to the updated Problem document.
   */
  async updateProblem(updatedProblem: UpdateProblemDto): Promise<Problem> {
    return await this.problemModel
      .findByIdAndUpdate(updatedProblem.id, updatedProblem, {
        returnDocument: 'after',
      })
      .exec();
  }

  /**
   * Updates the counts of a Problem document in the database.
   * @param newCount - The data transfer object containing the updated counts of the problem.
   * @returns A Promise that resolves to the updated Problem document.
   */
  async updateCounts(newCount: UpdateProblemCountsDto): Promise<Problem> {
    const { problemId, countType, count } = newCount;

    const update = { [countType]: count };

    return await this.problemModel
      .findByIdAndUpdate(problemId, { $set: update }, { new: true })
      .exec();
  }

  /**
   * Deletes a Problem document from the database.
   * @param id - The ID of the Problem document.
   * @returns A Promise that resolves to the deleted Problem document.
   */
  async deleteProblem(id: Types.ObjectId): Promise<Problem> {
    return await this.problemModel.findByIdAndDelete(id).exec();
  }

  /**
   * Searches for Problem documents in the database that match the given filter.
   * @param filter - The filter object to search for Problem documents.
   * @returns A Promise that resolves to an array of Problem documents.
   */
  async searchProblem(filter: Record<string, any>): Promise<Problem[]> {
    return await this.problemModel.find(filter).exec();
  }
}

import { Injectable } from '@nestjs/common';
import { Solution, SolutionDocument } from '../schemas';
import { DeleteResult, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SolutionActions } from '../../enums';
import { DatabaseRollBackException } from 'src/exceptions';
import { UpdateSolutionDto, voteSolutionDto, CreateSolutionDto } from '../dto';

/**
 * Repository class for managing solutions in the forum.
 * Provides methods to create, retrieve, update, delete, and rollback solutions.
 *
 * @class SolutionRepository
 * @constructor
 * @param {Model<SolutionDocument>} solutionModel - The Mongoose model for Solution documents.
 */
@Injectable()
export class SolutionRepository {
  constructor(
    @InjectModel(Solution.name) private solutionModel: Model<SolutionDocument>,
  ) {}

  /**
   * Rolls back a solution based on the specified action.
   *
   * This method performs different rollback operations depending on the action provided.
   * It supports rolling back the creation, update, deletion, and voting actions on a solution.
   *
   * @param {Solution} newSolution - The solution object that contains the current state of the solution.
   * @param {SolutionActions} actionToRollback - The action that needs to be rolled back.
   *                                             It can be one of the following:
   *                                             - `SolutionActions.CREATE`: Deletes the newly created solution.
   *                                             - `SolutionActions.UPDATE`: Reverts the solution to its previous state.
   *                                             - `SolutionActions.DELETE`: Restores the deleted solution.
   *                                             - `SolutionActions.VOTE`: Reverts the voting action on the solution.
   * @returns {Promise<Solution>} - A promise that resolves to the solution object after the rollback operation.
   * @throws {DatabaseRollBackException} - Throws an exception if the rollback action is invalid.
   */
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

  /**
   * Creates a new solution in the database.
   *
   * @param {CreateSolutionDto} newSolution - The data transfer object containing the details of the solution to be created.
   * @returns {Promise<Solution>} A promise that resolves to the created Solution object.
   *
   * @example
   * ```typescript
   * const newSolution: CreateSolutionDto = {
   *   title: 'How to fix login issue',
   *   description: 'Detailed steps to resolve the login issue...',
   *   author: 'John Doe',
   *   createdAt: new Date(),
   * };
   *
   * const createdSolution = await solutionRepository.createSolution(newSolution);
   * console.log(createdSolution);
   * ```
   *
   * @throws {Error} Throws an error if the solution could not be created.
   */
  async createSolution(newSolution: CreateSolutionDto): Promise<Solution> {
    return await new this.solutionModel(newSolution).save();
  }

  /**
   * Retrieves a list of solutions associated with a specific problem.
   *
   * @param {Types.ObjectId} problemId - The unique identifier of the problem for which solutions are being retrieved.
   * @returns {Promise<Solution[]>} A promise that resolves to an array of Solution objects.
   *
   * @example
   * ```typescript
   * const problemId = new Types.ObjectId("507f1f77bcf86cd799439011");
   * const solutions = await getSolutions(problemId);
   * console.log(solutions);
   * ```
   *
   * @throws {Error} Throws an error if the retrieval process fails.
   */
  async getSolutions(problemId: Types.ObjectId): Promise<Solution[]> {
    return await this.solutionModel.find({ problemId }).exec();
  }

  /**
   * Retrieves a solution by its unique identifier.
   *
   * @param {Types.ObjectId} solutionId - The unique identifier of the solution to retrieve.
   * @returns {Promise<Solution>} A promise that resolves to the solution object if found, or null if not found.
   *
   * @throws {Error} If there is an issue with the database query.
   *
   * @example
   * ```typescript
   * const solutionId = new Types.ObjectId("507f1f77bcf86cd799439011");
   * const solution = await getSolution(solutionId);
   * console.log(solution);
   * ```
   */
  async getSolution(solutionId: Types.ObjectId): Promise<Solution> {
    return await this.solutionModel.findById(solutionId).exec();
  }

  /**
   * Deletes a solution from the database by its unique identifier.
   *
   * @param {Types.ObjectId} solutionId - The unique identifier of the solution to be deleted.
   * @returns {Promise<Solution>} A promise that resolves to the deleted solution object.
   *
   * @throws {Error} If the solution cannot be found or deleted.
   *
   * @example
   * ```typescript
   * const deletedSolution = await deleteSolution(new Types.ObjectId("507f1f77bcf86cd799439011"));
   * console.log(deletedSolution);
   * ```
   */
  async deleteSolution(solutionId: Types.ObjectId): Promise<Solution> {
    return await this.solutionModel.findByIdAndDelete(solutionId).exec();
  }

  /**
   * Deletes all solutions associated with a specific problem ID.
   *
   * @param {Types.ObjectId} problemId - The unique identifier of the problem whose solutions are to be deleted.
   * @returns {Promise<DeleteResult>} A promise that resolves to the result of the delete operation.
   *
   * @example
   * ```typescript
   * const problemId = new Types.ObjectId("60d5ec49f1b2c72d88f8e8b5");
   * const result = await deleteAllSolution(problemId);
   * console.log(result.deletedCount); // Outputs the number of deleted documents
   * ```
   *
   * @throws {Error} Throws an error if the delete operation fails.
   */
  async deleteAllSolution(problemId: Types.ObjectId): Promise<DeleteResult> {
    return await this.solutionModel.deleteMany({ problemId }).exec();
  }

  /**
   * Updates the vote count for a specific solution.
   *
   * @param {voteSolutionDto} newCount - An object containing the solution ID, the type of vote to update, and the new vote count.
   * @param {string} newCount.solutionId - The ID of the solution to update.
   * @param {string} newCount.voteType - The type of vote to update (e.g., 'upvotes' or 'downvotes').
   * @param {number} newCount.vote - The new vote count to set for the specified vote type.
   * @returns {Promise<Solution>} A promise that resolves to the updated solution document.
   *
   * @throws {Error} If the solution ID is invalid or the update operation fails.
   *
   * @example
   * const newVote = { solutionId: '12345', voteType: 'upvotes', vote: 10 };
   * const updatedSolution = await updateVote(newVote);
   * console.log(updatedSolution);
   */
  async updateVote(newCount: voteSolutionDto): Promise<Solution> {
    const { solutionId, voteType, vote } = newCount;

    const update = { [voteType]: vote };

    return await this.solutionModel
      .findByIdAndUpdate(solutionId, { $set: update }, { new: true })
      .exec();
  }

  /**
   * Updates an existing solution in the database with the provided updated data.
   *
   * @param {Types.ObjectId} solutionId - The unique identifier of the solution to be updated.
   * @param {UpdateSolutionDto} updatedSolution - The data transfer object containing the updated solution details.
   * @returns {Promise<Solution>} - A promise that resolves to the updated solution document.
   *
   * @throws {Error} - Throws an error if the solution cannot be found or updated.
   *
   * @example
   * ```typescript
   * const updatedSolution = await updateSolution(solutionId, {
   *   title: 'Updated Solution Title',
   *   description: 'Updated description of the solution',
   *   // other fields to update
   * });
   * console.log(updatedSolution);
   * ```
   */
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

  /**
   * Updates a solution's vote count based on the provided query.
   *
   * @param {Types.ObjectId} solutionId - The unique identifier of the solution to be updated.
   * @param {any} query - The update query containing the vote changes to be applied.
   * @returns {Promise<Solution>} - A promise that resolves to the updated solution document.
   *
   * @throws {Error} - Throws an error if the solution cannot be found or updated.
   *
   * @example
   * ```typescript
   * const solutionId = new Types.ObjectId("507f1f77bcf86cd799439011");
   * const query = { $inc: { votes: 1 } };
   *
   * const updatedSolution = await voteSolution(solutionId, query);
   * console.log(updatedSolution);
   * ```
   */
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

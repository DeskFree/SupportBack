import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SolutionService } from './solution.service';
import { CreateSolutionDto, UpdateSolutionDto } from './dto';
import { Types } from 'mongoose';
import { Solution } from './schemas';
import { StringToObjectIdConverter } from '../pipes';
import { ErrorHandlerUtil } from 'src/utils/error-handler.util';
import { response } from 'express';

/**
 * Controller for handling solution-related operations in the forum.
 *
 * This controller provides endpoints for creating, retrieving, updating,
 * deleting, and voting on solutions associated with problems in the forum.
 *
 * The base route for this controller is `/forum/solution`.
 *
 * @class SolutionController
 * @constructor
 * @param {SolutionService} solutionService - The service used to handle solution-related operations.
 */
@Controller('forum/solution')
export class SolutionController {
  constructor(private readonly solutionService: SolutionService) {}

  @Post('/:id')
  /**
   * Creates a new solution for a specified problem.
   *
   * @param {Types.ObjectId} problemId - The ID of the problem to which the solution is being added.
   * @param {CreateSolutionDto} newSolution - The data transfer object containing the details of the new solution.
   * @returns {Promise<any>} A promise that resolves to the created solution object, including a response metadata message.
   * @throws {BadRequestException} If the solution creation fails.
   * @throws {Error} If an unexpected error occurs during the solution creation process.
   */
  async createSolution(
    @Param('id', StringToObjectIdConverter) problemId: Types.ObjectId,
    @Body() newSolution: CreateSolutionDto,
  ): Promise<any> {
    try {
      const solution = await this.solutionService.createSolution(
        problemId,
        newSolution,
      );

      if (!solution) {
        throw new BadRequestException(
          'Solution creation failed: Unable to create a new solution for the specified problem.',
        );
      }

      return {
        ...solution,
        responseMetadata: {
          message: 'Solution created successfully',
        },
      };
    } catch (error) {
      throw ErrorHandlerUtil.handleError(error);
    }
  }

  @Get('/:id')
  /**
   * Retrieves all solutions for a specified problem.
   *
   * @param {Types.ObjectId} problemId - The ID of the problem for which solutions are to be retrieved.
   * @returns {Promise<any>} A promise that resolves to an object containing the solutions and response metadata.
   * @throws {NotFoundException} If no solutions are found for the specified problem.
   * @throws {Error} If an error occurs while retrieving the solutions.
   */
  async getAllSolutions(
    @Param('id', StringToObjectIdConverter) problemId: Types.ObjectId,
  ): Promise<any> {
    const solutions = await this.solutionService
      .getSolutions(problemId)
      .then((solutions) => {
        if (!solutions || solutions.length === 0) {
          throw new NotFoundException(
            'No solutions found for the specified problem.',
          );
        }
        return solutions;
      })
      .catch((error) => {
        throw ErrorHandlerUtil.handleError(error);
      });
    return {
      ...solutions,
      responseMetadata: { message: 'Solutions retrieved successfully' },
    };
  }

  @Delete('/:id')
  /**
   * Deletes a solution by its ID.
   *
   * @param solutionId - The ID of the solution to be deleted, converted to a MongoDB ObjectId.
   * @returns A promise that resolves to an object containing the deleted solution and a response message,
   *          or throws a NotFoundException if no solution is found with the specified ID.
   * @throws Will throw an error if the deletion fails due to any other reason.
   */
  deleteSolution(
    @Param('id', StringToObjectIdConverter) solutionId: Types.ObjectId,
  ): Promise<any> {
    const solution = this.solutionService
      .deleteSolution(solutionId)
      .then((solution) => {
        if (!solution) {
          throw new NotFoundException(
            'Solution deletion failed: No solution found with the specified ID.',
          );
        }
        return {
          ...solution,
          responseMetadata: { message: 'Solution deleted successfully' },
        };
      })
      .catch((error) => {
        throw ErrorHandlerUtil.handleError(error);
      });
    return solution;
  }

  @Put('/:id')
  /**
   * Updates an existing solution with the provided data.
   *
   * @param solutionId - The ID of the solution to be updated, converted to an ObjectId.
   * @param updatedSolution - The data to update the solution with.
   * @returns A promise that resolves to the updated solution with a success message in the response metadata.
   * @throws NotFoundException - If no solution is found with the specified ID.
   * @throws Error - If an error occurs during the update process.
   */
  async updateSolution(
    @Param('id', StringToObjectIdConverter) solutionId: Types.ObjectId,
    @Body() updatedSolution: UpdateSolutionDto,
  ): Promise<Solution> {
    return await this.solutionService
      .updateSolution(solutionId, updatedSolution)
      .then((solution) => {
        if (!solution) {
          throw new NotFoundException(
            'Solution update failed: No solution found with the specified ID.',
          );
        }
        return {
          ...solution,
          responseMetadata: { message: 'Solution updated successfully' },
        };
      })
      .catch((error) => {
        throw ErrorHandlerUtil.handleError(error);
      });
  }

  @Put('/upvote/:id/:isUpVote')
 
  /**
   * Handles the voting of a solution by its ID.
   *
   * @param id - The ObjectId of the solution to be voted on, converted from a string parameter.
   * @param isUpVote - A boolean indicating whether the vote is an upvote (true) or a downvote (false).
   * @returns A promise that resolves to an object containing a response message if the vote is successful.
   * @throws {BadRequestException} If the voting process fails, either because the solution does not exist or there was an issue processing the vote.
   * @throws {Error} If an unexpected error occurs during the voting process, it is handled by the ErrorHandlerUtil.
   *
   * This method interacts with the `solutionService` to register a vote for a solution. It first attempts to vote on the solution
   * using the provided `id` and `isUpVote` parameters. If the voting is unsuccessful, it throws a `BadRequestException` with a
   * detailed error message. If any other error occurs, it is caught and handled by the `ErrorHandlerUtil`.
   */
  async voteProblem(
    @Param('id', StringToObjectIdConverter) id: Types.ObjectId,
    @Param('isUpVote') isUpVote: boolean,
  ): Promise<any> {
    try {
      const isVoted = await this.solutionService.voteSolution(id, isUpVote);
      if (!isVoted) {
        throw new BadRequestException(
          `Failed to upvote problem with ID '${id}'. The problem may not exist or there was an issue processing the ${isUpVote ? 'up vote' : 'down vote'}.`,
        );
      }

      return { responseMetadata: { message: 'Vote successful' } };
    } catch (error) {
      throw ErrorHandlerUtil.handleError(error);
    }
  }
}

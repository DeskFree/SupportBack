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
  Query,
  UsePipes,
} from '@nestjs/common';
import { ProblemService } from './problem.service';
import { SearchProblemDto, CreateProblemDto, UpdateProblemDto } from './dto';
import { ProblemValidator, StringToObjectIdConverter } from '../../pipes';
import { Types } from 'mongoose';
import { ErrorHandlerUtil } from 'src/utils';

/**
 * Controller class for handling HTTP requests related to Problem entities.
 * This class provides endpoints for creating, retrieving, updating, and deleting problems,
 * as well as voting on problems and searching for problems.
 */
@Controller('forum/problem')
export class ProblemController {
  /**
   * Constructs the ProblemController.
   * @param problemService - The service for handling business logic related to Problem entities.
   */
  constructor(private readonly problemService: ProblemService) {}

  /**
   * Handles the creation of a new Problem.
   * @param newProblem - The data transfer object containing the details of the problem to be created.
   * @returns A Promise that resolves to the created Problem document.
   * @throws HttpException - If an error occurs during the creation process.
   */
  @Post()
  @UsePipes(new ProblemValidator())
  async createProblem(@Body() newProblem: CreateProblemDto): Promise<any> {
    try {
      const problem = await this.problemService.createProblem(newProblem);
      return {
        ...problem,
        responseMetadata: {
          message: 'Problem created successfully',
        },
      };
    } catch (error) {
      throw ErrorHandlerUtil.handleError(error);
    }
  }

  /**
   * Handles the retrieval of problems based on search criteria or all problems if no criteria are provided.
   * @param param - The data transfer object containing the search criteria (optional).
   * @returns A Promise that resolves to an array of Problem documents.
   * @throws HttpException - If no problems are found or an error occurs during the retrieval process.
   */
  @Get()
  @UsePipes(new ProblemValidator())
  async getProblems(@Query() param: SearchProblemDto): Promise<any> {
    try {
      let problems;
      if (param && Object.keys(param).length) {
        problems = this.problemService.searchProblem(param);
      } else {
        problems = await this.problemService.getAllProblem();
      }
      if (!problems || problems.length === 0) {
        const message =
          param && (param.title || param.tags || param.status)
            ? `No problems found matching the given criteria: ${JSON.stringify(param)}`
            : 'No problems found';
        throw new NotFoundException(message);
      }
      return {
        ...problems,
        responseMetadata: { message: 'Problems retrieved successfully' },
      };
    } catch (error) {
      throw ErrorHandlerUtil.handleError(error);
    }
  }

  /**
   * Handles the update of an existing Problem.
   * @param id - The ID of the problem to update.
   * @param updatedProblem - The data transfer object containing the updated details of the problem.
   * @returns A Promise that resolves to the updated Problem document.
   * @throws HttpException - If the problem does not exist or an error occurs during the update process.
   */
  @Put('/:id')
  @UsePipes(new ProblemValidator())
  async updateProblem(
    @Param('id', StringToObjectIdConverter) id: Types.ObjectId,
    @Body() updatedProblem: UpdateProblemDto,
  ): Promise<any> {
    try {
      const problem = await this.problemService.updateProblem(
        id,
        updatedProblem,
      );
      if (!problem) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Failed to update problem with ID '${id}'. The problem may not exist or there was an issue processing the update.`,
        });
      }
      return {
        ...problem,
        responseMetadata: { message: 'Problem updated successfully' },
      };
    } catch (error) {
      throw ErrorHandlerUtil.handleError(error);
    }
  }

  /**
   * Handles the retrieval of a specific Problem along with its solutions.
   * @param id - The ID of the problem to retrieve.
   * @returns A Promise that resolves to the Problem document with populated solutions.
   * @throws HttpException - If the problem does not exist or an error occurs during the retrieval process.
   */
  @Get('/:id')
  async getProblem(
    @Param('id', StringToObjectIdConverter) id: Types.ObjectId,
  ): Promise<any> {
    try {
      const problem = await this.problemService.getProblemWithSolutions(id);

      if (!problem) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Failed to read problem with ID '${id}'. The problem may not exist or there was an issue processing the read.`,
        });
      }

      return {
        ...problem,
        responseMetadata: { message: 'Problem retrieved successfully' },
      };
    } catch (error) {
      throw ErrorHandlerUtil.handleError(error);
    }
  }

  /**
   * Handles the deletion of a specific Problem.
   * @param id - The ID of the problem to delete.
   * @returns A Promise that resolves to the deleted Problem document.
   * @throws HttpException - If the problem does not exist or an error occurs during the deletion process.
   */
  @Delete('/:id')
  async deleteProblem(
    @Param('id', StringToObjectIdConverter) id: Types.ObjectId,
  ): Promise<any> {
    try {
      const problem = await this.problemService.deleteProblem(id);

      if (!problem) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Failed to delete problem with ID '${id}'. The problem may not exist or there was an issue processing the read.`,
        });
      }
      return {
        ...problem,
        responseMetadata: { message: 'Problem deleted successfully' },
      };
    } catch (error) {
      throw ErrorHandlerUtil.handleError(error);
    }
  }

  /**
   * Handles voting on a specific Problem (upvote or downvote).
   * @param id - The ID of the problem to vote on.
   * @param isUpVote - Whether the vote is an upvote or downvote.
   * @returns A Promise that resolves to a boolean indicating whether the vote was successful.
   * @throws HttpException - If the problem does not exist or an error occurs during the voting process.
   */
  @Put('/upvote/:id/:isUpVote')
  async voteProblem(
    @Param('id', StringToObjectIdConverter) id: Types.ObjectId,
    @Param('isUpVote') isUpVote: boolean,
  ): Promise<any> {
    try {
      const isVoted = await this.problemService.vote(id, isUpVote);
      if (!isVoted) {
        throw new BadRequestException(
          `Failed to upvote problem with ID '${id}'. The problem may not exist or there was an issue processing the ${isUpVote ? 'up vote' : 'down vote'}.`,
        );
      }

      return {
        responseMetadata: {
          message: `Problem ${isUpVote ? 'upvoted' : 'downvoted'} successfully`,
        },
      };
    } catch (error) {
      throw ErrorHandlerUtil.handleError(error);
    }
  }
}

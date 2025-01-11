import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProblemService } from './problem.service';
import { SearchProblemDto } from './dto/search-problem.dto';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.Dto';
import { Problem } from './schemas/problem.schema';
import { ProblemValidator } from '../pipes/problem-validator.pipe';
import { ValidationError } from 'class-validator';
import { DatabaseException } from 'src/exceptions/database.exception';
import { LogFailureException } from 'src/exceptions/log-failure.exception';
import { UnauthorizedAccessException } from 'src/exceptions/unauthorized-access.exception';
import { TooManyRequestsException } from 'src/exceptions/too-many-requests-exception';
import { DuplicateException } from 'src/exceptions/duplicate-problem.exception';
import { Types } from 'mongoose';

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
  async createProblem(@Body() newProblem: CreateProblemDto): Promise<Problem> {
    try {
      return await this.problemService.createProblem(newProblem);
    } catch (error) {
      throw this.handleError(error);
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
  async getProblems(@Query() param: SearchProblemDto): Promise<Problem[]> {
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
      return problems;
    } catch (error) {
      throw this.handleError(error);
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
  updateProblem(
    @Param('id') id: Types.ObjectId,
    @Body() updatedProblem: UpdateProblemDto,
  ): Promise<Problem> {
    try {
      const problem = this.problemService.updateProblem(id, updatedProblem);
      if (!problem) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Failed to update problem with ID '${id}'. The problem may not exist or there was an issue processing the update.`,
        });
      }
      return problem;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handles the retrieval of a specific Problem along with its solutions.
   * @param id - The ID of the problem to retrieve.
   * @returns A Promise that resolves to the Problem document with populated solutions.
   * @throws HttpException - If the problem does not exist or an error occurs during the retrieval process.
   */
  @Get('/:id')
  getProblem(@Param('id') id: Types.ObjectId): Promise<Problem> {
    try {
      const problem = this.problemService.getProblemWithSolutions(id);

      if (!problem) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Failed to read problem with ID '${id}'. The problem may not exist or there was an issue processing the read.`,
        });
      }

      return problem;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handles the deletion of a specific Problem.
   * @param id - The ID of the problem to delete.
   * @returns A Promise that resolves to the deleted Problem document.
   * @throws HttpException - If the problem does not exist or an error occurs during the deletion process.
   */
  @Delete('/:id')
  deleteProblem(@Param('id') id: Types.ObjectId): Promise<Problem> {
    try {
      const problem = this.problemService.deleteProblem(id);

      if (!problem) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Failed to delete problem with ID '${id}'. The problem may not exist or there was an issue processing the read.`,
        });
      }
      return problem;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handles voting on a specific Problem (upvote or downvote).
   * @param id - The ID of the problem to vote on.
   * @param isUpVote - Whether the vote is an upvote or downvote.
   * @returns A Promise that resolves to a boolean indicating whether the vote was successful.
   * @throws HttpException - If the problem does not exist or an error occurs during the voting process.
   */
  @Post('/upvote/:id/:isUpVote')
  voteProblem(
    @Param('id') id: Types.ObjectId,
    @Param('isUpVote') isUpVote: boolean,
  ): Promise<boolean> {
    try {
      const isVoted = this.problemService.vote(id, isUpVote);
      if (isVoted) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Failed to upvote problem with ID '${id}'. The problem may not exist or there was an issue processing the upvote.`,
        });
      }

      return isVoted;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handles errors and maps them to appropriate HTTP exceptions.
   * @param error - The error that occurred.
   * @returns An HttpException with the appropriate status code and message.
   */
  private handleError(error: Error): HttpException {
    if (
      error instanceof BadRequestException ||
      error instanceof TooManyRequestsException ||
      error instanceof UnauthorizedAccessException ||
      error instanceof DuplicateException
    ) {
      return new BadRequestException({
        statusCode: error.getStatus(),
        message: error.message,
      });
    }
    if (error instanceof NotFoundException) {
      return new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Resource not found',
      });
    }
    if (
      error instanceof DatabaseException ||
      error instanceof LogFailureException
    ) {
      return new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    return new InternalServerErrorException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `Something Went Wrong : ${error.message}`,
    });
  }
}

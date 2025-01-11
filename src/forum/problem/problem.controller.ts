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

@Controller('forum/problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post()
  @UsePipes(new ProblemValidator())
  async createProblem(@Body() newProblem: CreateProblemDto): Promise<Problem> {
    try {
      return await this.problemService.createProblem(newProblem);
    } catch (error) {
      throw this.handleError(error);
    }
  }

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

  @Put('/:id')
  @UsePipes(new ProblemValidator())
  updateProblem(
    @Param('id') id: string,
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

  @Get('/:id')
  getProblem(@Param('id') id: string): Promise<Problem> {
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

  @Delete('/:id')
  deleteProblem(@Param('id') id: string): Promise<Problem> {
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

  @Post('/upvote/:id/:isUpVote')
  voteProblem(
    @Param('id') id: string,
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

  private handleError(error: Error): HttpException {
    if (
      error instanceof BadRequestException ||
      error instanceof TooManyRequestsException ||
      error instanceof UnauthorizedAccessException
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

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
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

@Controller('forum/problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post()
  @UsePipes(new ProblemValidator)
  async createProblem(@Body() newProblem: CreateProblemDto): Promise<Problem> {
    try {
      return await this.problemService.createProblem(newProblem);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get()
  @UsePipes(new ProblemValidator())
  async getProblems(@Query() param: SearchProblemDto): Promise<Problem[]> {
    if (Object.keys(param).length) {
      return this.problemService.searchProblem(param);
    } else {
      return await this.problemService.getAllProblem();
    }
  }

  @Put('/:id')
  @UsePipes(new ProblemValidator())
  updateProblem(@Param('id') id:string,@Body() updatedProblem: UpdateProblemDto): Promise<Problem> {
    return this.problemService.updateProblem(id,updatedProblem);
  }

  @Get('/:id')
  getProblem(@Param('id') id: string): Promise<Problem> {
    return this.problemService.getProblem(id);
  }

  @Delete('/:id')
  deleteProblem(@Param('id') id: string): Promise<Problem> {
    return this.problemService.deleteProblem(id);
  }
}

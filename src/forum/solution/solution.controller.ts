import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SolutionService } from './solution.service';
import { CreateSolutionDto, UpdateSolutionDto } from './dto';
import { Types } from 'mongoose';
import { Solution, SolutionWithMetadata } from './schemas';
import { StringToObjectIdConverter } from '../pipes';
import { ErrorHandlerUtil } from 'src/utils/error-handler.util';
import { ProblemResponseDto } from '../problem/dto/response-problem.dto';

@Controller('forum/solution')
export class SolutionController {
  constructor(private readonly solutionService: SolutionService) {}

  @Post('/:id')
  async createSolution(
    @Param('id', StringToObjectIdConverter) problemId: Types.ObjectId,
    @Body() newSolution: CreateSolutionDto,
  ): Promise<SolutionWithMetadata> {
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
        responseMetadata: { message: 'Solution created successfully' },
      };
    } catch (error) {
      throw ErrorHandlerUtil.handleError(error);
    }
  }

  @Get('/:id')
  getAllSolutions(
    @Param('id', StringToObjectIdConverter) problemId: Types.ObjectId,
  ): Promise<Solution[]> {
    return this.solutionService.getSolutions(problemId);
  }

  @Delete('/:id')
  deleteSolution(
    @Param('id', StringToObjectIdConverter) solutionId: Types.ObjectId,
  ): Promise<Solution> {
    return this.solutionService.deleteSolution(solutionId);
  }

  @Put('/:id')
  updateSolution(
    @Param('id', StringToObjectIdConverter) solutionId: Types.ObjectId,
    @Body() updatedSolution: UpdateSolutionDto,
  ): Promise<Solution> {
    return this.solutionService.updateSolution(solutionId, updatedSolution);
  }
}

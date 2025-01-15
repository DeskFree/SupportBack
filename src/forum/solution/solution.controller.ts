import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UsePipes,
} from '@nestjs/common';
import { SolutionService } from './solution.service';
import { CreateSolutionDto, UpdateSolutionDto } from './dto';
import { Types } from 'mongoose';
import { Solution } from './schemas';
import { StringToObjectIdConverter } from '../pipes';

@Controller('forum/solution')
export class SolutionController {
  constructor(private readonly solutionService: SolutionService) {}

  @Post('/:id')
  createSolution(
    @Param('id', StringToObjectIdConverter) problemId: Types.ObjectId,
    @Body() newSolution: CreateSolutionDto,
    @Res() res,
  ): Promise<Solution> {
    try {
      const solution = this.solutionService.createSolution(
        problemId,
        newSolution,
      );

      return solution;
    } catch (error) {}
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

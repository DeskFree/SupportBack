import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { SolutionService } from './solution.service';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { Types } from 'mongoose';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { Solution } from './schemas/solution.schema';
import { StringToObjectIdConverter } from '../pipes/id-string-to-obj-converter.pipe';

@Controller('forum/solution')
export class SolutionController {
  constructor(private readonly solutionService: SolutionService) {}

  @Post('/:id')
  createSolution(
    @Param('id', StringToObjectIdConverter) problemId: Types.ObjectId,
    @Body() newSolution: CreateSolutionDto,
  ): Promise<Solution> {
    problemId = new Types.ObjectId(problemId);
    return this.solutionService.createSolution(problemId, newSolution);
  }

  @Get('/:id')
  getAllSolutions(
    @Param('id', StringToObjectIdConverter) problemId: Types.ObjectId,
  ): Promise<Solution[]> {
    problemId = new Types.ObjectId(problemId);
    return this.solutionService.getSolutions(problemId);
  }

  @Delete('/:id')
  deleteSolution(
    @Param('id', StringToObjectIdConverter) solutionId: Types.ObjectId,
  ): Promise<Solution> {
    solutionId = new Types.ObjectId(solutionId);
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

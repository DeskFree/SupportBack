import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SolutionService } from './solution.service';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { Types } from 'mongoose';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { Solution } from './schemas/solution.schema';

@Controller('forum/solution')
export class SolutionController {
  constructor(private readonly solutionService: SolutionService) {}

  @Post('/:id')
  createSolution(
    @Param('id') problemId: Types.ObjectId,
    @Body() newSolution: CreateSolutionDto,
  ): Promise<Solution> {
    problemId = new Types.ObjectId(problemId);
    return this.solutionService.createSolution(problemId, newSolution);
  }

  @Get('/:id')
  getAllSolutions(@Param('id') problemId: Types.ObjectId): Promise<Solution[]> {
    problemId = new Types.ObjectId(problemId);
    return this.solutionService.getSolutions(problemId);
  }

  @Delete('/:id')
  deleteSolution(@Param('id') solutionId: Types.ObjectId): Promise<Solution> {
    solutionId = new Types.ObjectId(solutionId);
    return this.solutionService.deleteSolution(solutionId);
  }

  @Put('/:id')
  updateSolution(
    @Param('id') solutionId: Types.ObjectId,
    @Body() updatedSolution: UpdateSolutionDto,
  ): Promise<Solution> {
    console.log('id', typeof solutionId);
    return this.solutionService.updateSolution(solutionId, updatedSolution);
  }
}

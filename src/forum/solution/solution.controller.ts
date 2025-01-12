import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
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
    @Param('id') id:Types.ObjectId,
    @Body() newSolution: CreateSolutionDto,
  ):Promise <Solution> {
    id = new Types.ObjectId(id);
    return this.solutionService.createSolution(id, newSolution);
  }

  @Get('/:id')
  getAllSolutions(@Param('id') id: string):Promise <Solution[]> {
    return this.solutionService.getSolutions(id);
  }

  @Delete('/:id')
  deleteSolution(@Param('id') id: Types.ObjectId):Promise <Solution> {
    id = new Types.ObjectId(id);
    return this.solutionService.deleteSolution(id);
  }

  @Put('/:id')
  updateSolution(@Param('id') id: string,@Body() updatedSolution:UpdateSolutionDto):Promise <Solution> {
    return this.solutionService.updateSolution(id,updatedSolution);
  }
}

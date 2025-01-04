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
import { ProblemService } from './problem.service';
import { SearchProblemDto } from './dto/SearchProblem.dto';
import { CreateProblemDto } from './dto/createProblem.dto';
import { UpdateProblemDto } from './dto/updateProblem.dto';

@Controller('forum/problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post()
  createProblem(@Body() newProblem: CreateProblemDto) {
    return this.problemService.createProblem(newProblem);
  }

  @Get()
  getProblems(@Query() param: SearchProblemDto) {
    if (Object.keys(param).length) {
      return this.problemService.searchProblem(param);
    } else {
      return this.problemService.getAllProblem();
    }
  }

  @Put('/:id')
  updateProblem(
    @Param('id') id: string,
    @Body() updatedProblem: UpdateProblemDto,
  ) {
    updatedProblem.id = id;
    return this.problemService.updateProblem(updatedProblem);
  }

  @Get('/:id')
  getProblem(@Param('id') id: string) {
    return this.problemService.getProblem(id);
  }

  @Delete('/:id')
  deleteProblem(@Param('id') id: string) {
    return this.problemService.deleteProblem(id);
  }
}

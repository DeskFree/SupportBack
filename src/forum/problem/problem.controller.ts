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
  ValidationPipe,
} from '@nestjs/common';
import { ProblemService } from './problem.service';
import { SearchProblemDto } from './dtos/search-problem.dto';
import { CreateProblemDto } from './dtos/create-problem.dto';
import { UpdateProblemDto } from './dtos/update-problem.Dto';
import { ForumProblemStatusValidatorPipe } from './pipes/forum-problem-status-validator.pipe';

@Controller('forum/problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createProblem(@Body() newProblem: CreateProblemDto) {
    return this.problemService.createProblem(newProblem);
  }

  @Get()
  @UsePipes(ValidationPipe)
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

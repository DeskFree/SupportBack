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
import { SearchProblemDto } from './dto/search-problem.dto';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.Dto';
import { ForumProblemUpdateValidatorPipe } from './pipes/forum-problem-update-validator.pipe';
import { Problem } from './schemas/problem.schema';

@Controller('forum/problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createProblem(@Body() newProblem: CreateProblemDto) {
    return await this.problemService.createProblem(newProblem);
  }

  @Get()
  @UsePipes(new ForumProblemUpdateValidatorPipe)
  async getProblems(@Query() param: SearchProblemDto): Promise<Problem[]> {
    if (Object.keys(param).length) {
      return this.problemService.searchProblem(param);
    } else {
      return await this.problemService.getAllProblem();
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
  deleteProblem(@Param('id') id: string): Promise<Problem> {
    return this.problemService.deleteProblem(id);
  }
}

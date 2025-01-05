import { Injectable } from '@nestjs/common';
import { SearchProblemDto } from './dto/search-problem.dto';
import { Problem } from './schemas/problem.schema';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.Dto';
import { ProblemRepository } from './repository/problem.repository';

@Injectable()
export class ProblemService {
  constructor(private problemRepository: ProblemRepository) {}

  async createProblem(newProblem: CreateProblemDto): Promise<Problem> {
    const problem = await this.problemRepository.createProblem(newProblem);
    return problem;
  }

  async updateProblem(updatedProblem: UpdateProblemDto): Promise<Problem> {
    const problems = await this.problemRepository.updateProblem(updatedProblem);
    return problems;
  }

  async searchProblem(searchProblemDto: SearchProblemDto): Promise<Problem[]> {
    const { title, tags, status } = searchProblemDto;
    let filter: any = {};
    if (title) {
      filter.title = title;
    } else if (tags) {
      filter.tags = tags;
    } else if (status) {
      filter.status = status.toLocaleUpperCase();
    }
    let problems = await this.problemRepository.searchProblem(filter);
    return problems;
  }

  async getAllProblem(): Promise<Problem[]> {
    let problems = await this.problemRepository.getAllProblems();
    return problems;
  }
  getProblem(id: string): Problem[] {
    let problems = null;
    return problems;
  }

  async deleteProblem(id: string): Promise<Problem> {
    const problem = await this.problemRepository.deleteProblem(id);
    return problem;
  }
}

import { Injectable } from '@nestjs/common';
import { SearchProblemDto } from './dtos/search-problem.dto';
import { Problem } from './schemas/problem.schema';
import { CreateProblemDto } from './dtos/create-problem.dto';
import { UpdateProblemDto } from './dtos/update-problem.Dto';
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

  searchProblem(searchProblemDto: SearchProblemDto): Problem {
    const { title, tags, status } = searchProblemDto;
    let problems = null;
    if (title) {
      //problem filter query and assign it to var
    } else if (tags) {
      //problem filter query and assign it to var
    } else if (status) {
      //problem filter query and assign it to var
    }
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

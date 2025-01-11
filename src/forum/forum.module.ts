import { Module } from '@nestjs/common';
import { ProblemModule } from './problem/problem.module';
import { SolutionModule } from './solution/solution.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [ProblemModule, SolutionModule, LogModule]
})
export class ForumModule {}

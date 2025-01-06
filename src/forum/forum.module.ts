import { Module } from '@nestjs/common';
import { ProblemModule } from './problem/problem.module';
import { SolutionModule } from './solution/solution.module';
import { LogModule } from './log/log.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [ProblemModule, SolutionModule, LogModule, TagModule]
})
export class ForumModule {}

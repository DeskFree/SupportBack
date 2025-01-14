import { forwardRef, Module } from '@nestjs/common';
import { ProblemModule } from './problem/problem.module';
import { SolutionModule } from './solution/solution.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [
    forwardRef(() => ProblemModule), // Import ProblemModule
    forwardRef(() => SolutionModule), // Import SolutionModule
    LogModule,
  ],
})
export class ForumModule {}

import { forwardRef, Module } from '@nestjs/common';
import { ProblemModule } from './problem/problem.module';
import { SolutionModule } from './solution/solution.module';
import { LogModule } from './log/log.module';
// import { StringToObjectIdConverter } from './pipes/id-string-to-obj-converter.pipe';

@Module({
  imports: [
    forwardRef(() => ProblemModule), // Import ProblemModule
    forwardRef(() => SolutionModule), // Import SolutionModule
    LogModule,
  ],
  // providers: [
  //   {
  //     provide: 'IdConverter',
  //     useClass: StringToObjectIdConverter, // Make CustomPipe globally available within this module
  //   },
  // ],
})
export class ForumModule {}

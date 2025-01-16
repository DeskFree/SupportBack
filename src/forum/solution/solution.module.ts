import { forwardRef, Module } from '@nestjs/common';
import { SolutionController } from './solution.controller';
import { SolutionService } from './solution.service';
import { SolutionRepository } from './repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Solution, SolutionSchema } from './schemas';
import { ProblemModule } from '../problem/problem.module';
import { LogModule } from '../log/log.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Solution.name, schema: SolutionSchema },
    ]),
    forwardRef(() => ProblemModule),
    LogModule,
  ],
  controllers: [SolutionController],
  providers: [SolutionService, SolutionRepository],
  exports: [SolutionService],
})
export class SolutionModule {}

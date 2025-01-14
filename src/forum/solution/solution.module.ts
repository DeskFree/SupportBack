import { forwardRef, Module } from '@nestjs/common';
import { SolutionController } from './solution.controller';
import { SolutionService } from './solution.service';
import { SolutionRepository } from './repository/solution.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Solution, SolutionSchema } from './schemas/solution.schema';
import { ProblemRepository } from '../problem/repository/problem.repository';
import { ProblemModule } from '../problem/problem.module';
import { LogService } from '../log/log.service';
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

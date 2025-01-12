import { Module } from '@nestjs/common';
import { SolutionController } from './solution.controller';
import { SolutionService } from './solution.service';
import { SolutionRepository } from './repository/solution.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Solution, SolutionSchema } from './schemas/solution.schema';
import { ProblemRepository } from '../problem/repository/problem.repository';
import { ProblemModule } from '../problem/problem.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Solution.name,schema:SolutionSchema}]),ProblemModule],
  controllers: [SolutionController],
  providers: [SolutionService,SolutionRepository]
})
export class SolutionModule {}

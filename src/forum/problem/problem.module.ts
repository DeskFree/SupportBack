import { Module } from '@nestjs/common';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';
import { ProblemRepository } from './repository/problem.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Problem, ProblemnSchema } from './schemas/problem.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:Problem.name,schema:ProblemnSchema}])],
  controllers: [ProblemController],
  providers: [ProblemService,ProblemRepository]
})
export class ProblemModule {}

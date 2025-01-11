import { Module } from '@nestjs/common';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';
import { ProblemRepository } from './repository/problem.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Problem, ProblemSchema } from './schemas/problem.schema';
import { LogService } from '../log/log.service';
import { LogModule } from '../log/log.module';
import { RateLimitService } from '../rate-limit/rate-limit.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Problem.name, schema: ProblemSchema }]),
    LogModule,
  ],
  controllers: [ProblemController],
  providers: [ProblemService, ProblemRepository, RateLimitService],
})
export class ProblemModule {}

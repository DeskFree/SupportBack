import { Module } from '@nestjs/common';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';
import { ProblemModule } from './problem/problem.module';
import { SolutionModule } from './solution/solution.module';
import { CommentModule } from './comment/comment.module';
import { LogModule } from './log/log.module';
import { TagModule } from './tag/tag.module';

@Module({
  controllers: [ForumController],
  providers: [ForumService],
  imports: [ProblemModule, SolutionModule, CommentModule, LogModule, TagModule]
})
export class ForumModule {}

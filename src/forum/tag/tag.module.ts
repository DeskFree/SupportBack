import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from './schemas/tag.schema';
import { TagRepository } from './repository/tag.repository';

@Module({
  imports:[MongooseModule.forFeature([{name:Tag.name,schema:TagSchema}])],
  controllers: [TagController],
  providers: [TagService,TagRepository]
})
export class TagModule {}

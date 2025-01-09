import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NewTagDto } from './dto/new-tag.dto';
import { TagService } from './tag.service';
import mongoose from 'mongoose';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './schemas/tag.schema';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  addTag(@Body() newTag: NewTagDto): Promise<Tag> {
    return this.tagService.addTag(newTag);
  }

  @Get()
  getAllTags(): Promise<Tag[]> {
    return this.tagService.getAllTags();
  }

  @Put('/:id')
  updateTag(
    @Param('id') id: mongoose.Schema.Types.ObjectId,
    @Body() updatedTag: UpdateTagDto,
  ): Promise<Tag> {
    updatedTag.id = id; // will go to the pipes
    return this.tagService.updateTag(updatedTag);
  }

  @Delete('/:id')
  deleteTag(@Param('id') id: mongoose.Schema.Types.ObjectId): Promise<Tag> {
    return this.tagService.deleteTag(id);
  }
}

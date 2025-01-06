import { Injectable } from '@nestjs/common';
import { NewTagDto } from './dto/new-tag.dto';
import { TagRepository } from './repository/tag.repository';
import { Tag } from './schemas/tag.schema';
import mongoose from 'mongoose';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}
  addTag(newTag: NewTagDto): Promise<Tag> {
    return this.tagRepository.createTag(newTag);
  }

  updateTag(updatedTag:UpdateTagDto):Promise <Tag>{
    return this.tagRepository.updateTag(updatedTag)
  }
}

import { Injectable } from '@nestjs/common';
import { NewTagDto } from '../dto/new-tag.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from '../schemas/tag.schema';
import mongoose, { Model } from 'mongoose';
import { UpdateTagDto } from '../dto/update-tag.dto';

@Injectable()
export class TagRepository {

  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
  ) {}

  async createTag(newTag: NewTagDto):Promise <Tag> {
    return await new this.tagModel(newTag).save()
  }

  async updateTag(updatedTag: UpdateTagDto):Promise <Tag>{
    return await this.tagModel.findByIdAndUpdate(updatedTag.id,updatedTag)
  }

  async deleteTag(id:mongoose.Schema.Types.ObjectId):Promise <Tag>{
    return await this.tagModel.findByIdAndDelete(id);
  }

  async getAllTags():Promise <Tag[]>{
    return await this.tagModel.find();
  }
}

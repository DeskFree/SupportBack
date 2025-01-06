import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { NewTagDto } from './dto/new-tag.dto';
import { TagService } from './tag.service';
import mongoose from 'mongoose';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tag')
export class TagController {
    constructor(private readonly tagService:TagService){}

    @Post()
    addTag(@Body() newTag:NewTagDto){
        return this.tagService.addTag(newTag)
    }

    @Put('/:id')
    updateTag(@Param('id') id:mongoose.Schema.Types.ObjectId,@Body() updatedTag:UpdateTagDto){
        updatedTag.id=id; // will go to the pipes 
        return this.tagService.updateTag(updatedTag);
    }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from '../schemas/response.schema';
import { CreateResponseDto } from '../dto/create-response.dto';
import { UpdateResponseDto } from '../dto/update-response.dto';

@Injectable()
export class ResponseRepository {
  constructor(
    @InjectModel(Response.name) private readonly responseModel: Model<Response>,
  ) {}

  async create(createResponseDto: CreateResponseDto): Promise<Response> {
    const newResponse = new this.responseModel(createResponseDto);
    return newResponse.save();
  }

  async findAll(): Promise<Response[]> {
    return this.responseModel.find().exec();
  }

  async findOne(id: string): Promise<Response> {
    return this.responseModel.findById(id).exec();
  }

  async update(id: string, updateResponseDto: UpdateResponseDto): Promise<Response> {
    return this.responseModel
      .findByIdAndUpdate(id, updateResponseDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.responseModel.findByIdAndDelete(id).exec();
  }
}

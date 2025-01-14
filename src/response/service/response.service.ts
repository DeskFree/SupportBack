import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateResponseDto } from '../dto/create-response.dto';
import { UpdateResponseDto } from '../dto/update-response.dto';

@Injectable()
export class ResponseService {
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
    const response = await this.responseModel.findById(id).exec();
    if (!response) {
      throw new NotFoundException(`Response with ID ${id} not found.`);
    }
    return response;
  }

  async update(id: string, updateResponseDto: UpdateResponseDto): Promise<Response> {
    const updatedResponse = await this.responseModel
      .findByIdAndUpdate(id, updateResponseDto, { new: true })
      .exec();
    if (!updatedResponse) {
      throw new NotFoundException(`Response with ID ${id} not found.`);
    }
    return updatedResponse;
  }

  async delete(id: string): Promise<void> {
    const result = await this.responseModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Response with ID ${id} not found.`);
    }
  }
}
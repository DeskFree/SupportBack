import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Raising } from '../schemas/raising.schema';
import { CreateRaisingDto } from '../dto/create-raising.dto';
import { UpdateRaisingDto } from '../dto/update-raising.dto';


@Injectable()
export class RaisingRepository {
  constructor(@InjectModel(Raising.name) private readonly raisingModel: Model<Raising>) { }

  async create(createRaisingDto: CreateRaisingDto): Promise<Raising> {
    const newRaising = new this.raisingModel(createRaisingDto);
    return newRaising.save();
  }

  async findAll(): Promise<Raising[]> {
    return this.raisingModel.find().exec();
  }

  async findOne(id: string): Promise<Raising> {
    return this.raisingModel.findById(id).exec();
  }

  async update(id: string, updateRaisingDto: UpdateRaisingDto): Promise<Raising> {
    return this.raisingModel.findByIdAndUpdate(id, updateRaisingDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Raising> {
    return this.raisingModel.findByIdAndDelete(id).exec();
  }
}
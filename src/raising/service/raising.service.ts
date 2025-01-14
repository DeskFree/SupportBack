import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRaisingDto } from '../dto/create-raising.dto';
import { Raising } from '../schemas/raising.schema';
import { UpdateRaisingDto } from '../dto/update-raising.dto';

@Injectable()
export class RaisingService {
    constructor(
        @InjectModel(Raising.name) private readonly raisingModel: Model<Raising>,
    ) { }

    async create(createRaisingDto: CreateRaisingDto): Promise<Raising> {
        const newRaising = new this.raisingModel(createRaisingDto);
        return newRaising.save();
    }

    async findAll(): Promise<Raising[]> {
        return this.raisingModel.find().exec();
    }

    async findOne(id: string): Promise<Raising> {
        const raising = await this.raisingModel.findById(id).exec();
        if (!raising) {
            throw new NotFoundException(`Raising with ID ${id} not found.`);
        }
        return raising;
    }

    async update(id: string, updateRaisingDto: UpdateRaisingDto): Promise<Raising> {
        const updatedRaising = await this.raisingModel
            .findByIdAndUpdate(id, updateRaisingDto, { new: true })
            .exec();
        if (!updatedRaising) {
            throw new NotFoundException(`Raising with ID ${id} not found.`);
        }
        return updatedRaising;
    }

    async delete(id: string): Promise<void> {
        const result = await this.raisingModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Raising with ID ${id} not found.`);
        }
    }
}

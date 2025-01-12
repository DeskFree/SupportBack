import { Injectable } from '@nestjs/common';
import { RaisingRepository } from './repository/raising.repository';
import { CreateRaisingDto } from './dto/create-raising.dto';
import { UpdateRaisingDto } from './dto/update-raising.dto';

@Injectable()
export class RaisingService {
    constructor(private readonly raisingRepository: RaisingRepository) { }

    async create(raisingDto: CreateRaisingDto) {
        return this.raisingRepository.create(raisingDto);
    }

    async findAll() {
        return this.raisingRepository.findAll();
    }

    async findOne(id: string) {
        return this.raisingRepository.findOne(id);
    }

    async update(id: string, updateDto: UpdateRaisingDto) {
        return this.raisingRepository.update(id, updateDto);
    }

    async remove(id: string) {
        return this.raisingRepository.remove(id);
    }
}

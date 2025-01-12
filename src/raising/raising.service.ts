import { Injectable } from '@nestjs/common';
import { RaisingRepository } from './repository/raising.repository';
import { CreateRaisingDto } from './dto/create-raising.dto';
import { UpdateRaisingDto } from './dto/update-raising.dto';

@Injectable()
export class RaisingService {
    constructor(private readonly raisingRepository: RaisingRepository) { }

    async create(createRaisingDto: CreateRaisingDto) {
        return this.raisingRepository.create(createRaisingDto);
    }

    async findAll() {
        return this.raisingRepository.findAll();
    }

    async findOne(id: string) {
        return this.raisingRepository.findOne(id);
    }

    async update(id: string, updateRaisingDto: UpdateRaisingDto) {
        return this.raisingRepository.update(id, updateRaisingDto);
    }

    async remove(id: string) {
        return this.raisingRepository.remove(id);
    }
}

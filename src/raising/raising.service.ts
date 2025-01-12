import { Injectable } from '@nestjs/common';
import { RaisingRepository } from './repository/raising.repository';
import { CreateRaisingDto } from './dto/create-raising.dto';
import { UpdateRaisingDto } from './dto/update-raising.dto';

@Injectable()
export class RaisingService {
    constructor(private readonly raisingRepository: RaisingRepository) { }

    async create(raisingProblemDto: CreateRaisingDto) {
        return this.raisingRepository.create(raisingProblemDto);
    }

    async findAll() {
        return this.raisingRepository.findAll();
    }

    async findOne(id: string) {
        return this.raisingRepository.findOne(id);
    }

    async update(id: string, updateProblemDto: UpdateRaisingDto) {
        return this.raisingRepository.update(id, updateProblemDto);
    }

    async remove(id: string) {
        return this.raisingRepository.remove(id);
    }
}

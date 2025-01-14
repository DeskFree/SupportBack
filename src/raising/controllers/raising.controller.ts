import { Body, Controller, Delete, Get, Param, Post, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateRaisingDto } from '../dto/create-raising.dto';
import { UpdateRaisingDto } from '../dto/update-raising.dto';
import { RaisingService } from '../service/raising.service';

@Controller('raising')
export class RaisingController {
    constructor(private readonly raisingService: RaisingService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createRaisingDto: CreateRaisingDto) {
        return await this.raisingService.create(createRaisingDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAll() {
        return await this.raisingService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getById(@Param('id') id: string) {
        return await this.raisingService.findOne(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updateById(@Param('id') id: string, @Body() updateRaisingDto: UpdateRaisingDto) {
        return await this.raisingService.update(id, updateRaisingDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteById(@Param('id') id: string) {
        await this.raisingService.delete(id);
    }
}

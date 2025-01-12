import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RaisingService } from './raising.service';
import { CreateRaisingDto } from './dto/create-raising.dto';
import { UpdateRaisingDto } from './dto/update-raising.dto';

@Controller('raising')
export class RaisingController {
    constructor(private readonly raisingService: RaisingService) { }

    @Post()
    create(@Body() createRaisingDto: CreateRaisingDto) {
        return this.raisingService.create(createRaisingDto);
    }

    @Get()
    findAll() {
        return this.raisingService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.raisingService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateRaisingDto: UpdateRaisingDto) {
        return this.raisingService.update(id, updateRaisingDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.raisingService.remove(id);
    }
}
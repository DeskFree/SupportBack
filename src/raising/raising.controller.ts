import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RaisingService } from './raising.service';
import { CreateProblemDto } from 'src/forum/problem/dto/create-problem.dto';
import { UpdateProblemDto } from 'src/forum/problem/dto/update-problem.Dto';

@Controller('raising')
export class RaisingController {
    constructor(private readonly raisingService: RaisingService) { }

    @Post()
    create(@Body() createProblemDto: CreateProblemDto) {
        return this.raisingService.create(createProblemDto);
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
    update(@Param('id') id: string, @Body() updateProblemDto: UpdateProblemDto) {
        return this.raisingService.update(id, updateProblemDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.raisingService.remove(id);
    }
}
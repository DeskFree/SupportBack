import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ResponseService } from '../service/response.service';
import { CreateResponseDto } from '../dto/create-response.dto';
import { UpdateResponseDto } from '../dto/update-response.dto';

@Controller('responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  create(@Body() createResponseDto: CreateResponseDto) {
    return this.responseService.create(createResponseDto);
  }

  @Get()
  findAll() {
    return this.responseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responseService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateResponseDto: UpdateResponseDto,
  ) {
    return this.responseService.update(id, updateResponseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responseService.delete(id);
  }
}
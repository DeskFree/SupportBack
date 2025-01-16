import { Body, Controller, Delete, Get, Param, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFiles, Patch } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateRaisingDto } from '../dto/create-raising.dto';
import { UpdateRaisingDto } from '../dto/update-raising.dto';
import { RaisingService } from '../service/raising.service';
import { ValidationPipe } from '@nestjs/common';
import { File } from 'multer';

interface SuccessResponse {
    success: boolean;
    message: string;
    data?: any;
}

@Controller('raising')
export class RaisingController {
    constructor(private readonly raisingService: RaisingService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FilesInterceptor('documents'))
    async create(
        @Body(new ValidationPipe({ transform: true })) createRaisingDto: CreateRaisingDto,
        @UploadedFiles() files: File[]
    ): Promise<SuccessResponse> {
        if (files?.length) {
            createRaisingDto.documents = files.map(file => ({
                filename: file.originalname,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size
            }));
        }
        return await this.raisingService.create(createRaisingDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAll(): Promise<SuccessResponse> {
        return await this.raisingService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getById(@Param('id') id: string): Promise<SuccessResponse> {
        return await this.raisingService.findOne(id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FilesInterceptor('documents'))
    async updateById(
        @Param('id') id: string,
        @Body(new ValidationPipe({ transform: true })) updateRaisingDto: UpdateRaisingDto,
        @UploadedFiles() files: File[]
    ): Promise<SuccessResponse> {
        if (files?.length) {
            updateRaisingDto.documents = files.map(file => ({
                filename: file.originalname,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size
            }));
        }
        return await this.raisingService.update(id, updateRaisingDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK) // Changed from NO_CONTENT to OK since we're returning a response
    async deleteById(@Param('id') id: string): Promise<SuccessResponse> {
        return await this.raisingService.delete(id);
    }
}
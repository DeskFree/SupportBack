import { IsNotEmpty, IsString, IsOptional, IsArray, IsDateString, IsEnum, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { Priority, Status } from '../types/enums';

export class DocumentDto {
    @IsNotEmpty()
    @IsString()
    filename: string;

    @IsNotEmpty()
    @IsString()
    path: string;

    @IsNotEmpty()
    @IsString()
    mimetype: string;

    @IsNotEmpty()
    size: number;
}

export class CreateRaisingDto {
    @IsOptional()
    @IsString()
    ticket_id?: string; // Made optional since it will be auto-generated

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(100)
    title: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    description: string;

    @IsNotEmpty()
    @IsString()
    creator: string;

    @IsNotEmpty()
    @IsEnum(Priority)
    priority: Priority;

    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @IsOptional()
    @IsDateString()
    created_at?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    responses?: string[];

    @IsOptional()
    @IsArray()
    @Type(() => DocumentDto)
    documents?: DocumentDto[];
}
import { IsOptional, IsString, IsArray, IsDateString, IsEnum, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentDto } from './create-raising.dto';
import { Priority, Status } from '../types/enums';

export class UpdateRaisingDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

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
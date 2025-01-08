import { IsIn, IsNotEmpty, IsOptional, IsString, ValidationArguments } from 'class-validator';
import { ProblemStatus } from '../enums/status.enum';
import { Transform } from 'class-transformer';

export class SearchProblemDto {
  
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  tags?: string

  @IsOptional()
  status?: ProblemStatus
}
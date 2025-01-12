import { Types } from 'mongoose';
import { ProblemStatus } from '../enums/status.enum';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProblemDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId({ message: 'Invalid ID format' })
  id: Types.ObjectId;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsString()
  tryAndExpect?: string;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  status?: ProblemStatus;
}

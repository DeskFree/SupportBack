import { IsOptional, IsString, IsArray, IsDateString } from 'class-validator';

export class UpdateRaisingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  created_at?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  responses?: string[];
}

import { IsNotEmpty, IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateRaisingDto {
    @IsNotEmpty()
    @IsString()
    ticket_id: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    creator: string;

    @IsNotEmpty()
    @IsString()
    priority: string;

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

import { IsNotEmpty, IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateRaisingDto {
    @IsNotEmpty()
    @IsString()
    ticket_id: string; // Unique identifier for the ticket

    @IsNotEmpty()
    @IsString()
    title: string; // Title of the ticket

    @IsNotEmpty()
    @IsString()
    description: string; // Description of the ticket

    @IsNotEmpty()
    @IsString()
    creator: string; // Creator name of the ticket

    @IsNotEmpty()
    @IsString()
    priority: string; // Priority of the ticket (High, Medium, Low)

    @IsOptional() // Optional for create
    @IsString()
    status?: string; // Status of the ticket (Open, Closed)

    @IsOptional() // Optional for create
    @IsDateString()
    created_at?: string; // Creation timestamp

    @IsOptional() // Optional for create
    @IsArray()
    @IsString({ each: true })
    responses?: string[]; // Array of response IDs
}

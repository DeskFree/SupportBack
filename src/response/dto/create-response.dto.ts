import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResponseDto {
  @IsString()
  @IsNotEmpty()
  response_id: string;

  @IsString()
  @IsNotEmpty()
  ticket_id: string;

  @IsString()
  @IsNotEmpty()
  responder: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
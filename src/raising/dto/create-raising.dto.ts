import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRaisingDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

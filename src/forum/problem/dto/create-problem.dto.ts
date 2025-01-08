import { IsNotEmpty, NotEquals, IsIn, ValidationArguments, IsString } from 'class-validator';
import { ProblemStatus } from '../enums/status.enum';
import { Transform } from 'class-transformer';

export class CreateProblemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  details: string;

  tryAndExpect: string;

  tags: string;
  @NotEquals('CLOSE')
  status: ProblemStatus;
}

import {
  IsNotEmpty,
  NotEquals,
  IsIn,
  ValidationArguments,
  IsString,
  IsEmpty,
} from 'class-validator';
import { ProblemStatus } from '../enums/status.enum';

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

  @IsEmpty()
  createdBy: string;
}

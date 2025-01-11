import {
  IsNotEmpty,
  NotEquals,
  IsString,
  IsEmpty,
  Equals,
} from 'class-validator';
import { ProblemStatus } from '../enums/status.enum';
import { Types } from 'mongoose';

export class CreateProblemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  details: string;

  tryAndExpect: string;

  tags: string;

  @Equals(0)
  votes: number;

  @Equals(0)
  solutionCount: number;

  @Equals(0)
  views: number;

  @IsEmpty()
  solutions: Types.ObjectId;

  @IsNotEmpty()
  @NotEquals('CLOSE')
  status: ProblemStatus;

  @IsEmpty()
  createdBy: string;
}

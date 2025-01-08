import { IsIn, IsNotEmpty, ValidationArguments } from 'class-validator';
import { ProblemStatus } from '../enums/status.enum';
import { Transform } from 'class-transformer';

export class SearchProblemDto {

  title: string

  tags: string

  status: ProblemStatus
}
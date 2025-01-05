import { IsIn } from 'class-validator';
import { ProblemStatus } from '../enums/status.enum';

export class SearchProblemDto {
  title: string
  tags: string

  @IsIn(Object.values(ProblemStatus))
  status: ProblemStatus
}
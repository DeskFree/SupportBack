import { ProblemStatus } from '../enums/status.enum';

export interface SearchProblemDto {
  title: string;
  tags: string;
  status: ProblemStatus;
}
import { ProblemStatus } from '../enums/status.enum';

export class CreateProblemDto {
  title: string;
  details: string;
  tryAndExpect: string;
  tags: string;
  status: ProblemStatus;
}

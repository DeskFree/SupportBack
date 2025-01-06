import { ProblemStatus } from '../enums/status.enum';

export class UpdateProblemDto {
  id: string;
  title: string;
  details: string;
  tryAndExpect: string;
  tags: string;
  status: ProblemStatus;
}

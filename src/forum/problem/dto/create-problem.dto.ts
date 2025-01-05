import { IsNotEmpty, NotEquals, IsIn } from 'class-validator';
import { ProblemStatus } from '../enums/status.enum';

export class CreateProblemDto {

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  details: string;

  tryAndExpect: string;

  tags: string;

  @NotEquals('CLOSE')
  @IsIn(Object.values(ProblemStatus))
  status: ProblemStatus;
}

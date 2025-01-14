import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { VoteTypes } from '../enum/vote-types.enum';

export class voteSolutionDto {
  @IsNotEmpty()
  solutionId: Types.ObjectId;

  @IsNotEmpty()
  voteType: VoteTypes;

  @IsNotEmpty()
  vote: number;
}

import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { VoteTypes } from '../../enums';

export class voteSolutionDto {
  @IsNotEmpty()
  solutionId: Types.ObjectId;

  @IsNotEmpty()
  voteType: VoteTypes;

  @IsNotEmpty()
  vote: number;
}

import { Equals, IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSolutionDto {
  @IsEmpty()
  _id: Types.ObjectId;

  @IsNotEmpty()
  problemId: Types.ObjectId;

  @IsNotEmpty()
  details: string;

  @IsOptional()
  @Equals(0)
  @IsEmpty()
  upVotes?: number;

  @IsOptional()
  @Equals(0)
  @IsEmpty()
  downVotes?: number;

  @IsNotEmpty()
  createdBy: Types.ObjectId;

  @IsOptional()
  @Equals(false)
  isAccepted?: boolean;
}

import { Types } from 'mongoose';
import { ProblemStatus } from '../../enums';

export class ProblemResponseDto {
  _id: Types.ObjectId;

  title: string;

  details: string;

  tryAndExpect: string;

  tags: string;

  upVotes: number;

  downVotes: number;

  views: number;

  solutionCount: number;

  solutions: Types.ObjectId[];

  status: ProblemStatus;

  createdBy: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;

  responseMetadata: { message: string };
}

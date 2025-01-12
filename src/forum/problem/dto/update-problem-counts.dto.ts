import { Types } from 'mongoose';
import { Counts } from '../enums/counts.enum';

export class UpdateProblemCountsDto {
  problemId: Types.ObjectId;
  countType: Counts;
  count: number;
}

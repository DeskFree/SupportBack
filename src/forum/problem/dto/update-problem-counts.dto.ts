import { Types } from 'mongoose';
import { Counts } from '../../enums';

export class UpdateProblemCountsDto {
  problemId: Types.ObjectId;
  countType: Counts;
  count: number;
}

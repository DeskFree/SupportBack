import { Types } from 'mongoose';
import { Counts } from '../enums/counts.enum';

export class UpdateProblemCountsDto {
  problemId: string;
  countType: Counts;
  count: number;
}

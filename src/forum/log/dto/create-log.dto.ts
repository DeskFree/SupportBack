import { Types } from 'mongoose';
import { LogActions } from '../enum/log-actions.enum';

export class CreateLogDto {
  userId: Types.ObjectId;

  action: LogActions;

  targetId?: Types.ObjectId;

  targetModel: string;

  isSuccess?: boolean;

  details?: string;
}

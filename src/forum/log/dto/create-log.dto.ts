import mongoose, { Types } from 'mongoose';
import { LogActions } from '../enum/log-actions.enum';

export class CreateLogDto {
  userId: any;

  action: LogActions;

  targetId?: Types.ObjectId;

  targetModel: string;

  isSuccess?: boolean;

  details?: string;
}

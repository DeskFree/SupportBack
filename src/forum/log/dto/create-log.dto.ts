import { Types } from 'mongoose';
import { LogActions } from '../../enums';

export class CreateLogDto {
  userId: Types.ObjectId;

  action: LogActions;

  targetId?: Types.ObjectId;

  targetModel: string;

  isSuccess?: boolean;

  details?: string;
}

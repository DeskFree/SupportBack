import mongoose from 'mongoose';
import { LogActions } from '../enum/log-actions.enum';

export class CreateLogDto {
  userId: any;

  action: LogActions;

  targetId?: string;

  targetModel: string;

  isSuccess?: boolean;

  details?: string;
}

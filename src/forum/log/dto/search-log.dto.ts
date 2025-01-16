import { Types } from 'mongoose';
import { LogActions, targetModels } from 'src/forum/enums';

export class SearchLogDto {
  readonly action?: LogActions;
  readonly targetModel?: targetModels;
  readonly targetId?: Types.ObjectId;
}

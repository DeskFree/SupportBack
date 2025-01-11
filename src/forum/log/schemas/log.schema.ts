import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { LogActions } from '../enum/log-actions.enum';
import { targetModels } from '../enum/log-models.enum';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  action: LogActions;

  @Prop({
    type: Types.ObjectId,
    refPath: 'targetModel',
    required: false,
  })
  targetId: Types.ObjectId;

  @Prop({ type: String, required: false })
  targetModel: targetModels;

  @Prop({ type: Boolean, required: false, default: true })
  isSuccess: boolean;

  @Prop({ type: String, required: false })
  details: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);

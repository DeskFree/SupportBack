import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { LogActions } from '../enum/log-actions.enum';
import { targetModels } from '../enum/log-models.enum';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true })
  action: LogActions;

  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'targetModel', required: false })
  targetId: mongoose.Schema.Types.ObjectId; 

  @Prop({ type: String, required: false })
  targetModel: targetModels; 

  @Prop({ type: String, required: false })
  details: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);

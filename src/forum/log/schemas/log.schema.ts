import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { LogActions } from '../enum/log-actions.enum';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: LogActions, required: true })
  action: LogActions;

  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'targetModel', required: false })
  targetId: mongoose.Schema.Types.ObjectId; 

  @Prop({ type: String, required: false })
  targetModel: string; 

  @Prop({ type: String, required: false })
  details: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);

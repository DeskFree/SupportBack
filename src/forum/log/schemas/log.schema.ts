import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true })
  action: string; 

  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'targetModel', required: false })
  targetId: mongoose.Schema.Types.ObjectId; 

  @Prop({ type: String, required: false })
  targetModel: string; 

  @Prop({ type: String, required: false })
  details: string; 

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);

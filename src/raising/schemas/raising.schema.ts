import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Raising extends Document {
  @Prop({ required: true, unique: true })
  ticket_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  creator: string;

  @Prop({ required: true })
  priority: string;

  @Prop({ required: true, default: 'Open' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: [String], default: [] })
  responses: string[];
}

export const RaisingSchema = SchemaFactory.createForClass(Raising);

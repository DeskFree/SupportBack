import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Raising extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: 'open' })
  status: string;
}

export const RaisingSchema = SchemaFactory.createForClass(Raising);
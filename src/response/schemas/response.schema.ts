import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Response extends Document {
  @Prop({ unique: true, required: true })
  response_id: string;

  @Prop({ required: true })
  ticket_id: string;

  @Prop({ required: true })
  responder: string;

  @Prop({ required: true })
  message: string;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
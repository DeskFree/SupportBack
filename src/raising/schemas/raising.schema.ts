import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Priority, Status } from '../types/enums';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Raising extends Document {
  @Prop({ required: true, unique: true })
  ticket_id: string;

  @Prop({ required: true, minlength: 5, maxlength: 100 })
  title: string;

  @Prop({ required: true, minlength: 10 })
  description: string;

  @Prop({ required: true })
  creator: string;

  @Prop({ required: true, enum: Object.values(Priority) })
  priority: Priority;

  @Prop({ required: true, default: Status.OPEN, enum: Object.values(Status) })
  status: Status;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: [String], default: [] })
  responses: string[];

  @Prop({
    type: [{
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
      uploaded_at: { type: Date, default: Date.now }
    }], default: []
  })
  documents: Array<{
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    uploaded_at: Date;
  }>;
}

export const RaisingSchema = SchemaFactory.createForClass(Raising);
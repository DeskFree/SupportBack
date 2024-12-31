import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Tag {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: Number, default: 0 })
  usageCount: number;
}

export const TagSchema = SchemaFactory.createForClass(Tag);

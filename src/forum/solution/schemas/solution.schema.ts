import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SolutionDocument = Solution & Document;

@Schema({ timestamps: true })
export class Solution {
  @Prop({ type: Types.ObjectId, ref: 'Problem', required: true })
  problemId: Types.ObjectId;

  @Prop({ type: String, required: true })
  details: string;

  @Prop({ type: Number, default: 0 })
  votes: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isAccepted: boolean;
}

export const SolutionSchema = SchemaFactory.createForClass(Solution);

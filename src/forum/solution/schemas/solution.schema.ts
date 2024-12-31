import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type SolutionDocument = Solution & Document;

@Schema({ timestamps: true })
export class Solution {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true })
  problemId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true })
  details: string;

  @Prop({ type: Number, default: 0 })
  votes: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isAccepted: boolean;
}

export const SolutionSchema = SchemaFactory.createForClass(Solution);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProblemStatus } from '../enums/status.enum';

export type ProblemDocument = Problem & Document;

@Schema({ timestamps: true,})
export class Problem {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId()})
  _id: Types.ObjectId;


  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  details: string;

  @Prop({ type: String, required: false })
  tryAndExpect: string;

  @Prop({ type: String, required: false })
  tags: string;

  @Prop({ type: Number, default: 0 })
  votes: number;

  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: Number, default: 0 })
  solutionCount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Solution' }] })
  solutions: Types.ObjectId[];

  @Prop({ type: String, required: false })
  status: ProblemStatus;

  @Prop({ type: String, required: true })
  createdBy: Types.ObjectId;
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);
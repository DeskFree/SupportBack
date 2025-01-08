import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProblemStatus } from '../enums/status.enum';

export type ProblemDocument = Problem & Document;

@Schema({ timestamps: true })
export class Problem {
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
  answerCount: number;

  @Prop({ type: String, required: false })
  status: ProblemStatus;
}

export const ProblemnSchema = SchemaFactory.createForClass(Problem);

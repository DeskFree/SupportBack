import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProblemStatus } from '../enums/status.enum';

export type ProblemDocument = Problem & Document;

@Schema({ timestamps: true })
export class Problem {
  @Prop()
  title: string;

  @Prop()
  details: string;

  @Prop()
  tryAndExpect: string;

  @Prop()
  tags: string;

  @Prop()
  votes: string;

  @Prop()
  views: string;

  @Prop()
  answerCount: string;

  @Prop()
  status: ProblemStatus;
}

export const ProblemnSchema = SchemaFactory.createForClass(Problem);

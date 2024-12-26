import { Schema } from "@nestjs/mongoose";


@Schema({
  timestamps: true
})
export class Book {
  title: string;
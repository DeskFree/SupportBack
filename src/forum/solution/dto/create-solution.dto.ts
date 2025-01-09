import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateSolutionDto {
  @IsNotEmpty()
  problemId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  details: string;

  votes: number;
  @IsNotEmpty()
  createdBy: mongoose.Schema.Types.ObjectId;

  isAccepted: boolean;
}

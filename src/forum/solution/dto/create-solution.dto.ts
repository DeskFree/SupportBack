import { IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class CreateSolutionDto {

  user
  @IsNotEmpty()
  problemId: Types.ObjectId;
  @IsNotEmpty()
  details: string;

  votes: number;
  
  @IsNotEmpty()
  createdBy: Types.ObjectId;

  isAccepted: boolean;
}

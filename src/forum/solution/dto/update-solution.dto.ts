import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class UpdateSolutionDto {
  @IsNotEmpty()
  details: string;
}

import { IsNotEmpty } from "class-validator";

export class UpdateSolutionDto {
  @IsNotEmpty()
  details: string;
}

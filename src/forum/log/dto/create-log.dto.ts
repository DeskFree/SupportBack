import mongoose from "mongoose";
import { LogActions } from "../enum/log-actions.enum";

export class CreateLogDto {
      userId: mongoose.Schema.Types.ObjectId;
    
      action: LogActions;
    
      targetId: mongoose.Schema.Types.ObjectId; 
    
      targetModel: string; 
    
      details: string;
}
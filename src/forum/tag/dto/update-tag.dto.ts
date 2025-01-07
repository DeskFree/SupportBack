import mongoose from "mongoose";

export class UpdateTagDto{
    id:mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
}
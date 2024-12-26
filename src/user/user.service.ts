import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findById(uuid: string): Promise<User> {
    return await this.userModel.findById(uuid).exec();
  }

  //update user
  async updateUser(uuid: string, user: User): Promise<User> {
    return this.userModel.findByIdAndUpdate(uuid, user, { new: true });
  }

  // find user by email
  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }
}

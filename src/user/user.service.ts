import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './schemas/user.schema';
import { UserRegisterDto } from './dto/userRegister.dto';

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

  //create user
  async createUser(user: UserRegisterDto): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  //update user
  async updateUser(uuid: string, user: User): Promise<User> {
    return this.userModel.findByIdAndUpdate(uuid, user, { new: true });
  }

  // find user by email
  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  //validate user
  async validateUser(email: string, password: string): Promise<boolean> {
    return this.findByEmail(email).then((user) => {
      if (user.password === password) {
        return true;
      }
      return false;
    });
  }
}

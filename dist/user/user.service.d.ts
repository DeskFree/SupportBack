import * as mongoose from 'mongoose';
import { User } from './schemas/user.schema';
export declare class UserService {
    private userModel;
    constructor(userModel: mongoose.Model<User>);
    findAll(): Promise<User[]>;
    findById(uuid: string): Promise<User>;
    updateUser(uuid: string, user: User): Promise<User>;
    findByEmail(email: string): Promise<User>;
}

import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { UserRegisterDto } from './dto/userRegister.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginrDto } from './dto/loginDto.dto';
export declare class AuthService {
    private readonly userModel;
    private jwtService;
    constructor(userModel: Model<User>, jwtService: JwtService);
    register(userRegisterDto: UserRegisterDto): Promise<{
        token: string;
    }>;
    login(loginDto: LoginrDto): Promise<{
        token: string;
    }>;
}

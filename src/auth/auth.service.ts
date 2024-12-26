import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { UserRegisterDto } from './dto/userRegister.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { LoginrDto } from './dto/loginDto.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(userRegisterDto: UserRegisterDto): Promise<{ token: string }> {
    const { name, email, password } = userRegisterDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const uuid = uuidv4();
    const role = 'ROLE_USER';
    const token = this.jwtService.sign({ uuid, email, name, role });

    const user = this.userModel.create({
      name,
      email,
      password: hashedPassword,
      uuid: uuid,
      role,
      status: 'ACTIVE',
    });

    return { token };
  }

  async login(loginDto: LoginrDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { token };
  }
}

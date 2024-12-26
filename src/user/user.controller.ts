import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  //get one user
  @Get('')
  async getUser(uuid: string): Promise<User> {
    return this.userService.findById(uuid);
  }

  //register user
  @Post('register')
  async registerUser(@Body() user: User): Promise<User> {
    return this.userService.createUser(user);
  }

  //login
  @Post('login')
  async loginUser(@Body() user: User): Promise<boolean> {
    return this.userService.validateUser(user.email, user.password);
  }
}

import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { Controller, Get } from '@nestjs/common';

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
}

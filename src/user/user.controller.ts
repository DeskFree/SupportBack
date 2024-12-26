import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}

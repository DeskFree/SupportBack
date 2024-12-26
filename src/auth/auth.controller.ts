import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/userRegister.dto';
import { LoginrDto } from './dto/loginDto.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<{ token: string }> {
    return this.authService.register(userRegisterDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginrDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }
}

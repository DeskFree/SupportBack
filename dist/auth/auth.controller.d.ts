import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/userRegister.dto';
import { LoginrDto } from './dto/loginDto.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(userRegisterDto: UserRegisterDto): Promise<{
        token: string;
    }>;
    login(loginDto: LoginrDto): Promise<{
        token: string;
    }>;
}

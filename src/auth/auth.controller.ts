import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto, SignUpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ message: string }> {
    await this.authService.signUp(signUpDto);
    return {
      message: 'User registered successfully. Please log in to contunue.',
    };
  }

  @Post('/login')
  async login(@Body() logInDto: LogInDto): Promise<{ message: string }> {
    await this.authService.logIn(logInDto);
    return {
      message: 'Login successful. Welcome back!',
    };
  }
}

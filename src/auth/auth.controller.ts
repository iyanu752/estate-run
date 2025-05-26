import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto, SignUpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  async login(@Body() logInDto: LogInDto): Promise<{ token: string }> {
    return this.authService.logIn(logInDto);
  }
}

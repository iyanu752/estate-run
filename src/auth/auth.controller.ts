import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LogInDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authSrv: AuthService) {}

  @Post('/signUp')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authSrv.signUp(signUpDto);
  }

  @Get('/signIn')
  async login(@Body() logInDto: LogInDto): Promise<{ token: string }> {
    return this.authSrv.logIn(logInDto);
  }
}

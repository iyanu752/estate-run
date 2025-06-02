import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto, SignUpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ user: string }> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('/login')
  async login(
    @Body() logInDto: LogInDto,
  ): Promise<{ token: string; user: any }> {
    return await this.authService.logIn(logInDto);
  }
}

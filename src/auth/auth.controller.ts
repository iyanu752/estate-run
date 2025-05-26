import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authSrv: AuthService) {}

  @Post('/signUp')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authSrv.signUp(signUpDto);
  }
}

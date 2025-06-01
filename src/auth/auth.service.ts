import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LogInDto, SignUpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ user: any }> {
    const { firstName, lastName, email, password, userType } = signUpDto;
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    // return { user: existingUser };
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password with higher salt rounds for better security
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const user = await this.userModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        userType,
      });
      const userResponse = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
      };

      return { user: userResponse };
    } catch (error) {
      console.log('Error during user creation:', error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000) {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async logIn(logInDto: LogInDto): Promise<{ token: string; user: any }> {
    const { email, password } = logInDto;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new NotFoundException('No user found with this email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const payload = {
      id: user._id,
      email: user.email,
      userType: user.userType,
    };
    const token = this.jwtService.sign(payload);

    // Return user without password
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
    };

    return { token, user: userResponse };
  }
}

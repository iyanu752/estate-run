import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/user.schema';
import { UpdateProfileDto } from './dto/userProfile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async getProfile(userId: string): Promise<{ user: User }> {
    try {
      const profile = await this.userModel.findById(userId).select('-password');
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }
      return { user: profile };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve profile',
        error,
      );
    }
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<{ user: User; message: string }> {
    try {
      const updatedProfile = await this.userModel.findByIdAndUpdate(
        userId,
        { $set: updateProfileDto },
        { new: true, runValidators: true, select: '-password' },
      );
      const existingUser = await this.userModel.findOne({
        email: updateProfileDto.email,
      });
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new BadRequestException('Email already in use by another user');
      }
      if (!updatedProfile) {
        throw new InternalServerErrorException('Failed to update profile');
      }
      return { user: updatedProfile, message: 'Profile Updated' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update profile', error);
    }
  }

  async deleteProfile(userId: string): Promise<void> {
    try {
      const result = await this.userModel.findByIdAndDelete(userId);
      if (!result) {
        throw new NotFoundException('Profile not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete profile', error);
    }
  }
}

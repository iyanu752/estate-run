import {
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
    const profile = await this.userModel.findById(userId).select('-password');
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return { user: profile };
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<{ user: User }> {
    const updatedProfile = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateProfileDto },
      { new: true, runValidators: true, select: '-password' },
    );
    if (!updatedProfile) {
      throw new InternalServerErrorException('Failed to update profile');
    }
    return { user: updatedProfile };
  }

  async deleteProfile(userId: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(userId);
    if (!result) {
      throw new NotFoundException('Profile not found');
    }
  }
}

import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/userProfile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/:id')
  async getProfile(@Param('id') userId: string): Promise<{ user: any }> {
    const profile = await this.profileService.getProfile(userId);
    return {
      user: profile.user,
    };
  }

  @Put('/:id')
  async updateProfile(
    @Param('id') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<{ user: any }> {
    const updatedProfile = await this.profileService.updateProfile(
      userId,
      updateProfileDto,
    );
    return {
      user: updatedProfile.user,
    };
  }

  @Delete('/:id')
  async deleteProfile(@Param('id') userId: string): Promise<void> {
    await this.profileService.deleteProfile(userId);
    return;
  }
}

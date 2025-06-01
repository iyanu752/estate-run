import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/userProfile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/:id')
  async getProfile(@Param('id') userId: string): Promise<{ user: any }> {
    return await this.profileService.getProfile(userId);
  }

  @Put('/:id')
  async updateProfile(
    @Param('id') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<{ user: any; message: string }> {
    return await this.profileService.updateProfile(userId, updateProfileDto);
  }

  @Delete('/:id')
  async deleteProfile(@Param('id') userId: string): Promise<void> {
    return await this.profileService.deleteProfile(userId);
  }
}

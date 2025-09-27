import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CodesService } from './codes.service';
import { CreateCodeDto } from './dto/codes.dto';
import { Code } from './codeschema';

@Controller('codes')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Post('/createCode')
  async createCode(@Body() createCodeDto: CreateCodeDto) {
    return this.codesService.createVerificationCode(createCodeDto);
  }

  @Get('/getCode')
  async getAllCodes() {
    return this.codesService.getAllCodes();
  }

  @Get(':id')
  async getCodeById(@Param('id') id: string) {
    return this.codesService.getCodeById(id);
  }

  @Get('user/:userId')
  async getCodesByUser(@Param('userId') userId: string): Promise<Code[]> {
    return this.codesService.getCodesByUserId(userId);
  }

  @Put(':id')
  async updateCode(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateCodeDto>,
  ) {
    return this.codesService.updateCode(id, updateData);
  }

  @Delete(':id')
  async deleteCode(@Param('id') id: string) {
    return this.codesService.deleteCode(id);
  }

  @Post('verify')
  async verifyCode(@Body() body: { id: string; verificationCode: number }) {
    return this.codesService.verifyCode(body.id, body.verificationCode);
  }
}

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

@Controller('codes')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Post()
  async createCode(@Body() createCodeDto: CreateCodeDto) {
    return this.codesService.createVerificationCode(createCodeDto);
  }

  @Get()
  async getAllCodes() {
    return this.codesService.getAllCodes();
  }

  @Get(':id')
  async getCodeById(@Param('id') id: string) {
    return this.codesService.getCodeById(id);
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

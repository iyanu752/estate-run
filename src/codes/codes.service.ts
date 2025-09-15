/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Code } from './codeschema';
import { CreateCodeDto } from './dto/codes.dto';

@Injectable()
export class CodesService {
  constructor(
    @InjectModel(Code.name)
    private readonly codeModel: Model<Code>,
  ) {}

  async createVerificationCode(createCodeDto: CreateCodeDto): Promise<Code> {
    try {
      const {
        visitorName,
        visitorPhone,
        purposeOfVisit,
        date,
        from,
        to,
        specialInstructions,
      } = createCodeDto;

      if (!(visitorName && date && from && to)) {
        throw new NotFoundException('Fill in required fields');
      }

      const verificationCode = Math.floor(1000 + Math.random() * 9000);

      const newCode = new this.codeModel({
        visitorName,
        visitorPhone,
        purposeOfVisit,
        date,
        from,
        to,
        specialInstructions,
        verificationCode,
      });

      return await newCode.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create verification code',
        error,
      );
    }
  }

  async getAllCodes(): Promise<Code[]> {
    try {
      return await this.codeModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch codes', error);
    }
  }

  async getCodeById(id: string): Promise<Code> {
    try {
      const code = await this.codeModel.findById(id).exec();
      if (!code) throw new NotFoundException('Code not found');
      return code;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch code', error);
    }
  }

  async updateCode(
    id: string,
    updateData: Partial<CreateCodeDto>,
  ): Promise<Code> {
    try {
      const code = await this.codeModel.findById(id).exec();
      if (!code) throw new NotFoundException('Code not found');

      delete updateData['verificationCode'];

      Object.assign(code, updateData);

      return await code.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to update code', error);
    }
  }

  async deleteCode(id: string): Promise<{ message: string }> {
    try {
      const result = await this.codeModel.findByIdAndDelete(id).exec();
      if (!result) throw new NotFoundException('Code not found');
      return { message: 'Code deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete code', error);
    }
  }

  async verifyCode(
    id: string,
    verificationCode: number,
  ): Promise<{ verified: boolean; message: string }> {
    try {
      const codeDoc = await this.codeModel.findById(id).exec();
      if (!codeDoc) throw new NotFoundException('Code not found');

      if (codeDoc.verificationCode !== verificationCode) {
        throw new UnauthorizedException('Invalid verification code');
      }
      codeDoc.codeStatus = 'Used';
      await codeDoc.save();
      return { verified: true, message: 'Verification successful' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to verify code');
    }
  }
}

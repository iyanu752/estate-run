/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Code } from './codeschema';
import { CreateCodeDto } from './dto/codes.dto';
import { Counter } from './counterschema';
import { Types } from 'mongoose';
@Injectable()
export class CodesService {
  constructor(
    @InjectModel(Code.name)
    private readonly codeModel: Model<Code>,
    @InjectModel(Counter.name)
    private readonly counterModel: Model<Counter>,
  ) {}

  async getNextSequence(name: string): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    return counter.seq;
  }

  async createVerificationCode(createCodeDto: CreateCodeDto): Promise<Code> {
    try {
      if (
        !(
          createCodeDto.visitorName &&
          createCodeDto.date &&
          createCodeDto.from &&
          createCodeDto.to &&
          createCodeDto.userId
        )
      ) {
        throw new InternalServerErrorException('Fill in required fields');
      }

      const verificationCode = Math.floor(1000 + Math.random() * 9000);
      const sequence = await this.getNextSequence('code_seq');
      const formattedSeq = String(sequence).padStart(3, '0');
      const year = new Date().getFullYear();
      const id = `VIS-${year}-${formattedSeq}`;

      const newCode = new this.codeModel({
        ...createCodeDto,
        id,
        verificationCode,
      });

      return await newCode.save();
    } catch (error) {
      console.error('failed to create verification code', error);
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
      const code = await this.codeModel.findById(id).populate('userId').exec();
      if (!code) throw new NotFoundException('Code not found');
      return code;
    } catch (error) {
      console.error('unable to get verification codes', error);
      throw new InternalServerErrorException('Failed to fetch code', error);
    }
  }

  async getCodesByUserId(userId: string): Promise<Code[]> {
    try {
      if (!isValidObjectId(userId)) {
        throw new BadRequestException('Invalid userId format');
      }

      const codes = await this.codeModel
        .find({ userId: new Types.ObjectId(userId) })
        .populate('userId')
        .exec();

      if (!codes || codes.length === 0) {
        throw new NotFoundException('No codes found for this user');
      }

      return codes;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch codes', error);
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

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SuperMarket } from './supermarketschema';
import { Model } from 'mongoose';
import { User } from 'src/users/userschema';
import { CreateSupermarketDto } from './dto/supermarket.dto';

@Injectable()
export class SupermarketService {
  constructor(
    @InjectModel(SuperMarket.name)
    private supermarketModel: Model<SuperMarket>,

    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async createSupermarket(
    createSupermarketDto: CreateSupermarketDto,
  ): Promise<SuperMarket> {
    try {
      const owner = await this.userModel.findById(createSupermarketDto.ownerId);
      if (!owner) {
        throw new NotFoundException('Owner not found');
      }

      if (owner.userType !== 'vendor') {
        throw new BadRequestException(
          'Only business owners can create supermarkets',
        );
      }

      return this.supermarketModel.create(createSupermarketDto);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create supermarket',
        error,
      );
    }
  }

  async getAllSupermarkets(): Promise<SuperMarket[]> {
    try {
      return this.supermarketModel.find();
    } catch (error) {
      throw new InternalServerErrorException(
        ' Failed to get supermarkets',
        error,
      );
    }
  }

  async getSupermarketById(id: string): Promise<SuperMarket> {
    try {
      const supermarket = await this.supermarketModel.findById(id);
      if (!supermarket) {
        throw new NotFoundException('Supermarket not found');
      }
      return supermarket;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get supermarket by Id',
        error,
      );
    }
  }

  async updateSupermarket(
    id: string,
    updateSupermarketDto: CreateSupermarketDto,
  ): Promise<SuperMarket> {
    try {
      const supermarket = await this.supermarketModel.findByIdAndUpdate(
        id,
        updateSupermarketDto,
        { new: true },
      );

      if (!supermarket) {
        throw new NotFoundException('Supermarket not found');
      }
      return supermarket;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update supermarket',
        error,
      );
    }
  }

  async deleteSupermarket(id: string): Promise<void> {
    try {
      const supermarket = await this.supermarketModel.findByIdAndDelete(id);
      if (!supermarket) {
        throw new NotFoundException('Supermarket not found');
      }
    } catch (error) {
      throw new InternalServerErrorException(
        ' Failed to delete supermarket',
        error,
      );
    }
  }
}

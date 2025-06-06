import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { SupermarketService } from './supermarket.service';
import { CreateSupermarketDto } from './dto/supermarket.dto';
import { SuperMarket } from './supermarketschema';

@Controller('supermarket')
export class SupermarketController {
  constructor(private supermarketService: SupermarketService) {}

  @Post()
  async createSupermarket(
    @Body() createSupermarketDto: CreateSupermarketDto,
  ): Promise<SuperMarket> {
    return await this.supermarketService.createSupermarket(
      createSupermarketDto,
    );
  }

  @Get()
  async getAllSupermarkets(): Promise<SuperMarket[]> {
    return await this.supermarketService.getAllSupermarkets();
  }

  @Get(':id')
  async getSupermarketById(id: string): Promise<SuperMarket> {
    return await this.supermarketService.getSupermarketById(id);
  }

  @Put(':id')
  async updateSupermarket(
    id: string,
    updateSupermarketDto: CreateSupermarketDto,
  ): Promise<SuperMarket> {
    return await this.supermarketService.updateSupermarket(
      id,
      updateSupermarketDto,
    );
  }

  @Delete(':id')
  async deleteSupermarket(id: string): Promise<void> {
    return await this.supermarketService.deleteSupermarket(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get('/')
  async getAllProducts(): Promise<{ products: any[] }> {
    const products = await this.productService.getProducts();
    return {
      products: products,
    };
  }

  @Get('/:id')
  async getProductById(
    @Param('id') productId: string,
  ): Promise<{ product: any }> {
    const product = await this.productService.getProductsById(productId);
    return {
      product: product,
    };
  }

  @Post('/')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<{ product: any; message: string }> {
    const product = await this.productService.createProduct(createProductDto);
    return {
      product: product,
      message: 'Product created successfully',
    };
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') productId: string,
    @Body() createProductDto: CreateProductDto,
  ): Promise<{ product: any; message: string }> {
    const product = await this.productService.updateProduct(
      productId,
      createProductDto,
    );
    return {
      product: product,
      message: 'Product updated sucessfully',
    };
  }

  @Delete('/:id')
  async deleteProduct(
    @Param('id') productId: string,
  ): Promise<{ message: string }> {
    await this.productService.deleteProduct(productId);
    return {
      message: 'Product deleted successfully',
    };
  }
}

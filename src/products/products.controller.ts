import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  // UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/product.dto';
// import { JwtAuthGuard } from 'src/auth/auth.guard';

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

  // @UseGuards(JwtAuthGuard)
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

  @Get('/:id')
  async getProductById(
    @Param('id') productId: string,
  ): Promise<{ product: any }> {
    const product = await this.productService.getProductsById(productId);
    return {
      product: product,
    };
  }

  @Get('vendor/:id')
  async getProductByVendor(
    @Param('id') productId: string,
  ): Promise<{ product: any }> {
    const product = await this.productService.getProductsByVendor(productId);
    return {
      product: product,
    };
  }

  @Get('supermarket/:id')
  async getProductsBySupermarket(@Param('id') supermarketId: string) {
    return this.productService.getProductsBySupermarket(supermarketId);
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

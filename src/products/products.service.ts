import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from 'src/products/productschema';
import { CreateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  async getProducts(): Promise<Product[]> {
    try {
      const products = await this.productModel.find().exec();
      if (!products || products.length === 0) {
        throw new NotFoundException('No products found');
      }
      return products;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve products',
        error,
      );
    }
  }

  async getProductsById(productId: string): Promise<Product> {
    try {
      const product = await this.productModel.findById(productId).exec();
      if (!product) {
        throw new NotFoundException(`product with id ${productId} not found`);
      }
      return product;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve product with id ${productId}`,
        error,
      );
    }
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const {
        name,
        category,
        description,
        price,
        location,
        stock,
        image,
        method,
      } = createProductDto;
      if (
        !name ||
        !category ||
        !description ||
        !price ||
        !location ||
        !stock ||
        !image ||
        !method
      ) {
        throw new NotFoundException('All fields are required');
      }
      const newProduct = new this.productModel({
        name,
        category,
        description,
        price,
        location,
        stock,
        image,
        method,
      });
      return await newProduct.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create product', error);
    }
  }

  async updateProduct(
    productId: string,
    updateProductDto: CreateProductDto,
  ): Promise<Product> {
    try {
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(productId, updateProductDto, {
          new: true,
          runValidators: true,
        })
        .exec();
      if (!updatedProduct) {
        throw new NotFoundException(`product with id ${productId} not found`);
      }
      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update product', error);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      const result = await this.productModel
        .findByIdAndDelete(productId)
        .exec();
      if (!result) {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }
      return;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete product', error);
    }
  }
}

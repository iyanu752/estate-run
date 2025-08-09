import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

import { Product } from 'src/products/productschema';
import { CreateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  // Get all products (for admin/vendor use)
  async getAllProducts(): Promise<Product[]> {
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

  async getProductsBySupermarket(ownerId: string) {
    return this.productModel.find({
      ownerId: ownerId,
      isAvailable: true,
    });
  }

  // Get only available products (for residents/customers)
  async getAvailableProducts(): Promise<Product[]> {
    try {
      const products = await this.productModel
        .find({ isAvailable: true })
        .exec();
      if (!products || products.length === 0) {
        throw new NotFoundException('No available products found');
      }
      return products;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve available products',
        error,
      );
    }
  }

  // Get products with role-based filtering
  async getProducts(userRole?: string): Promise<Product[]> {
    try {
      const query: FilterQuery<Product> = {};

      // If user is a regular resident/customer, only show available products
      if (userRole === 'user') {
        query.isAvailable = true;
      }
      // Admin and vendors can see all products

      const products = await this.productModel.find(query).exec();
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

  async getProductsByVendor(ownerId: string): Promise<Product[]> {
    try {
      const products = await this.productModel.find({ ownerId }).exec();
      if (!products || products.length === 0) {
        throw new NotFoundException('No products found for this vendor');
      }
      return products;
    } catch (error) {
      console.error('Error retrieving products by vendor', error);
      throw new InternalServerErrorException(
        'Failed to retrieve vendor products',
      );
    }
  }

  async getProductsById(
    productId: string,
    userRole?: string,
  ): Promise<Product> {
    try {
      const query: FilterQuery<Product> = { _id: productId };

      // If user is a regular resident, only allow access to available products
      if (userRole === 'user') {
        query.isAvailable = true;
      }

      const product = await this.productModel.findOne(query).exec();
      if (!product) {
        throw new NotFoundException(
          userRole === 'user'
            ? `Product not available or not found`
            : `Product with id ${productId} not found`,
        );
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
        isAvailable,
        stock,
        quantity,
        image,
        unit,
        ownerId,
      } = createProductDto;

      // Check required fields
      if (
        !name ||
        !category ||
        price === undefined ||
        isAvailable === undefined ||
        !unit
      ) {
        throw new NotFoundException('All fields are required');
      }

      const newProduct = new this.productModel({
        name,
        category,
        description,
        price,
        quantity,
        isAvailable,
        stock,
        image,
        unit,
        ownerId,
      });
      return await newProduct.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create product', error);
    }
  }

  async updateProduct(
    productId: string,
    updateProductDto: Partial<CreateProductDto>,
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

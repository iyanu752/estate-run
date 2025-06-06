import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Category } from './categoryschema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    try {
      const category = this.categoryModel.create(createCategoryDto);
      return category;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create category',
        error,
      );
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      return this.categoryModel.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get all categories',
        error,
      );
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      const category = await this.categoryModel.findById(id);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return category;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get Category by Id',
        error,
      );
    }
  }

  async updateCategory(
    id: string,
    updateCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async deleteCategory(id: string): Promise<Category> {
    const category = await this.categoryModel.findByIdAndDelete(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
}

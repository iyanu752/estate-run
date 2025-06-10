import { Body, Controller, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/category.dto';
import { Category } from './categoryschema';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('/')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryService.getAllCategories();
  }

  async getCategoryById(id: string): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }

  async updateCategory(
    id: string,
    updateCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  async deleteCatefory(id: string): Promise<Category> {
    return this.categoryService.deleteCategory(id);
  }
}

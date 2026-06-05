import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetCategoriesResponse } from './schemas/category.schema';

@ApiTags('category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  @ApiOkResponse({ type: GetCategoriesResponse })
  public async findAll() {
    return this.categoryService.getAll();
  }
}

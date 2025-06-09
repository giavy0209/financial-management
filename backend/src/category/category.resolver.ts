/** @format */

import { Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  AppMutation,
  QueryList,
} from 'src/common/decorators/resolvers.decorator';
import { Category } from './category.type';
import { FieldMap } from 'src/common/decorators/field-map.decorator';
import { Input } from 'src/common/decorators/input.decorator';
import { CreateCategoryInput } from './input/create-category.input';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { UpdateCategoryInput } from './input/update-category.input';
import { DeleteCategoryInput } from './input/delete-category.input';
@Resolver('Category')
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @QueryList(Category)
  async categories(
    @Pagination() pagination: Pagination,
    // @FieldMap('categories.data') fieldMap: FieldMap,
    // @CurrentUser() user: JwtPayload['user'],
  ) {
    console.log({ pagination });

    // const { data, total } = await this.categoryService.getCategories(
    //   user.id,
    //   pagination,
    //   fieldMap,
    // );
    return {
      data: [],
      total: 10,
      message: 'Categories fetched successfully',
    };
  }

  @AppMutation(Category)
  async createCategory(
    @Input() input: CreateCategoryInput,
    @CurrentUser() user: JwtPayload['user'],
    @FieldMap('createCategory.data') fieldMap: FieldMap,
  ) {
    const data = this.categoryService.createCategory(input, user.id, fieldMap);
    return {
      data,
      message: 'Category created successfully',
    };
  }

  @AppMutation(Category)
  async updateCategory(
    @Input() input: UpdateCategoryInput,
    @CurrentUser() user: JwtPayload['user'],
    @FieldMap('updateCategory.data') fieldMap: FieldMap,
  ) {
    const data = this.categoryService.updateCategory(input, user.id, fieldMap);
    return {
      data,
      message: 'Category updated successfully',
    };
  }

  @AppMutation(Boolean)
  async deleteCategory(
    @Input() input: DeleteCategoryInput,
    @CurrentUser('deleteCategory.data') user: JwtPayload['user'],
  ) {
    const data = this.categoryService.deleteCategory(input, user.id);
    return {
      data,
      message: 'Category deleted successfully',
    };
  }
}

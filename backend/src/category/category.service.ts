/** @format */

import { Injectable } from '@nestjs/common';
import { FieldMap } from 'src/common/decorators/field-map.decorator';
import { InjectDatabase } from 'src/common/decorators/inject-database.decorator';
import { CreateCategoryInput } from './input/create-category.input';
import { UpdateCategoryInput } from './input/update-category.input';
import { DeleteCategoryInput } from './input/delete-category.input';

@Injectable()
export class CategoryService {
  @InjectDatabase() private readonly prisma: PrismaService;

  async createCategory(
    { name }: CreateCategoryInput,
    userId: number,
    fieldMap: FieldMap,
  ) {
    await this.prisma.category.exists(
      {
        name,
        userId,
      },
      { throwCase: 'IF_EXISTS', message: `Category ${name} already exists` },
    );
    const data = await this.prisma.category.create({
      data: {
        name,
        userId,
      },
      select: fieldMap,
    });
    return data;
  }

  async getCategories(
    userId: number,
    pagination: Pagination,
    fieldMap: FieldMap,
  ) {
    console.log({ pagination });

    const { data, total } = await this.prisma.category.findAndPagination({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: pagination.skip,
      take: pagination.take,
      select: fieldMap,
    });
    return {
      data,
      total,
    };
  }

  async getCategory(id: number, userId: number) {
    return this.prisma.category.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async updateCategory(
    { id, name }: UpdateCategoryInput,
    userId: number,
    fieldMap: FieldMap,
  ) {
    await this.prisma.category.exists(
      {
        id,
        userId,
      },
      { throwCase: 'IF_NOT_EXISTS', message: `Category ${id} not found` },
    );

    await this.prisma.category.exists(
      {
        name,
        userId,
        id: {
          not: id,
        },
      },
      { throwCase: 'IF_EXISTS', message: `Category ${name} already exists` },
    );

    const data = await this.prisma.category.update({
      where: {
        id,
        userId,
      },
      data: {
        name,
      },
      select: fieldMap,
    });
    return data;
  }

  async deleteCategory({ id }: DeleteCategoryInput, userId: number) {
    await this.prisma.category.exists(
      {
        id,
        userId,
      },
      { throwCase: 'IF_NOT_EXISTS', message: `Category ${id} not found` },
    );
    await this.prisma.category.delete({
      where: {
        id,
        userId,
      },
    });
    return true;
  }
}

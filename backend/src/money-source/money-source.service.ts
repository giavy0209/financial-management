import { Injectable } from '@nestjs/common';
import { InjectDatabase } from 'src/common/decorators/inject-database.decorator';
import { FieldMap } from 'src/common/decorators/field-map.decorator';
import { CreateMoneySourceInput } from './input/create-money-source.input';
import { UpdateMoneySourceInput } from './input/update-money-source.input';

@Injectable()
export class MoneySourceService {
  @InjectDatabase() prisma: PrismaService;

  async getMoneySources(
    userId: number,
    pagination: Pagination,
    fieldMap: FieldMap,
  ) {
    const { data, total } = await this.prisma.moneySource.findAndPagination({
      where: { userId },
      skip: pagination.skip,
      take: pagination.take,
      select: fieldMap,
    });

    return { data, total };
  }

  async createMoneySource(
    userId: number,
    { name, value }: CreateMoneySourceInput,
    fieldMap: FieldMap,
  ) {
    await this.prisma.moneySource.exists(
      { userId, name },
      {
        throwCase: 'IF_EXISTS',
        message: `Money source ${name} already exists`,
      },
    );

    const moneySource = await this.prisma.moneySource.create({
      data: {
        name,
        value,
        userId,
      },
      select: fieldMap,
    });

    return moneySource;
  }

  async updateMoneySource(
    userId: number,
    { id, name }: UpdateMoneySourceInput,
    fieldMap: FieldMap,
  ) {
    await this.prisma.moneySource.exists(
      {
        id,
        userId,
      },
      { throwCase: 'IF_NOT_EXISTS', message: `Money source not found` },
    );

    await this.prisma.moneySource.exists(
      { userId, name, id: { not: id } },
      {
        throwCase: 'IF_EXISTS',
        message: `Money source ${name} already exists`,
      },
    );

    const moneySource = await this.prisma.moneySource.update({
      where: { id },
      data: {
        name,
      },
      select: fieldMap,
    });

    return moneySource;
  }

  async deleteMoneySource(userId: number, id: number) {
    await this.prisma.moneySource.exists(
      { id, userId },
      { throwCase: 'IF_NOT_EXISTS', message: `Money source not found` },
    );

    await this.prisma.moneySource.delete({
      where: { id },
    });

    return true;
  }
}

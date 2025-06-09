import { Injectable } from '@nestjs/common';
import { InjectDatabase } from 'src/common/decorators/inject-database.decorator';
import { FieldMap } from 'src/common/decorators/field-map.decorator';

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
    input: { name: string },
    fieldMap: FieldMap,
  ) {
    const moneySource = await this.prisma.moneySource.create({
      data: {
        ...input,
        userId,
      },
      select: fieldMap,
    });

    return moneySource;
  }

  async updateMoneySource(
    userId: number,
    input: { id: number; name: string },
    fieldMap: FieldMap,
  ) {
    await this.prisma.moneySource.exists(
      {
        id: input.id,
        userId,
      },
      { throwCase: 'IF_NOT_EXISTS', message: `Money source not found` },
    );

    const moneySource = await this.prisma.moneySource.update({
      where: { id: input.id },
      data: {
        name: input.name,
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

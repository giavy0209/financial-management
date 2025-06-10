import { Injectable } from '@nestjs/common';
import { InjectDatabase } from 'src/common/decorators/inject-database.decorator';
import { GetTransactionInput } from './input/get-transaction.input';
import { CreateTransactionInput } from './input/create-transaction.input';
import { UpdateTransactionInput } from './input/update-transaction.input';
import { generateQueryRange } from 'src/common/helpers/generate-where-range';
import { FieldMap } from 'src/common/decorators/field-map.decorator';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionService {
  @InjectDatabase() prisma: PrismaService;

  async getTransactions(
    userId: number,
    { categoryId, fromAmount, toAmount, fromDate, toDate }: GetTransactionInput,
    pagination: Pagination,
    fieldMap: FieldMap,
  ) {
    const where: Prisma.TransactionWhereInput = { userId };
    if (categoryId) where.categoryId = categoryId;
    const whereAmount = generateQueryRange(fromAmount, toAmount);
    const whereDate = generateQueryRange(fromDate, toDate);

    if (whereAmount) where.amount = whereAmount;
    if (whereDate) where.createdAt = whereDate;

    const { data, total } = await this.prisma.transaction.findAndPagination({
      where,
      skip: pagination.skip,
      take: pagination.take,
      select: fieldMap,
    });

    return { data, total };
  }

  async createTransaction(
    userId: number,
    {
      amount,
      categoryId,
      createdAt,
      moneySourceId,
      description,
    }: CreateTransactionInput,
    fieldMap: FieldMap,
  ) {
    await this.prisma.moneySource.exists(
      { id: moneySourceId, userId },
      { throwCase: 'IF_NOT_EXISTS', message: `Money source not found` },
    );

    await this.prisma.category.exists(
      { id: categoryId, userId },
      { throwCase: 'IF_NOT_EXISTS', message: `Category not found` },
    );

    const transaction = await this.prisma.transaction.create({
      data: {
        amount,
        categoryId,
        createdAt,
        moneySourceId,
        description,
        userId,
      },
      select: fieldMap,
    });

    await this.prisma.moneySource.update({
      where: { id: moneySourceId },
      data: {
        value: { increment: amount },
      },
    });

    return transaction;
  }

  async updateTransaction(
    userId: number,
    {
      amount,
      id,
      categoryId,
      description,
      createdAt,
      moneySourceId,
    }: UpdateTransactionInput,
    fieldMap: FieldMap,
  ) {
    await this.prisma.moneySource.exists(
      { id: moneySourceId, userId },
      { throwCase: 'IF_NOT_EXISTS', message: `Money source not found` },
    );

    await this.prisma.category.exists(
      { id: categoryId, userId },
      { throwCase: 'IF_NOT_EXISTS', message: `Category not found` },
    );

    const currentTransaction = await this.prisma.transaction.findFirstOrThrow(
      {
        where: { id, userId },
      },
      { throwCase: 'IF_NOT_EXISTS', message: `Transaction not found` },
    );

    await this.prisma.moneySource.update({
      where: { id: currentTransaction.moneySourceId },
      data: {
        value: {
          decrement: currentTransaction.amount,
        },
      },
    });

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        amount,
        description,
        categoryId,
        createdAt,
        moneySourceId,
      },
      select: fieldMap,
    });

    await this.prisma.moneySource.update({
      where: { id: moneySourceId },
      data: {
        value: { increment: amount },
      },
    });

    return updatedTransaction;
  }

  async deleteTransaction(userId: number, id: number) {
    await this.prisma.transaction.exists(
      { id, userId },
      { throwCase: 'IF_NOT_EXISTS', message: `Transaction not found` },
    );

    await this.prisma.transaction.delete({
      where: { id },
    });

    return true;
  }
}

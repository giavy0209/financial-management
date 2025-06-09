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
    input: CreateTransactionInput,
    fieldMap: FieldMap,
  ) {
    const transaction = await this.prisma.transaction.create({
      data: {
        ...input,
        userId,
      },
      select: fieldMap,
    });

    return transaction;
  }

  async updateTransaction(
    userId: number,
    input: UpdateTransactionInput,
    fieldMap: FieldMap,
  ) {
    await this.prisma.transaction.exists(
      {
        id: input.id,
        userId,
      },
      { throwCase: 'IF_NOT_EXISTS', message: `Transaction not found` },
    );

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: input.id },
      data: {
        amount: input.amount,
        description: input.description,
        categoryId: input.categoryId,
      },
      select: fieldMap,
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

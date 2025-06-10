import { Injectable } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  QueryList,
  AppMutation,
} from 'src/common/decorators/resolvers.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GetTransactionInput } from './input/get-transaction.input';
import { CreateTransactionInput } from './input/create-transaction.input';
import { UpdateTransactionInput } from './input/update-transaction.input';
import { Transaction } from './transaction.type';
import { Input } from 'src/common/decorators/input.decorator';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { FieldMap } from 'src/common/decorators/field-map.decorator';
import { Filters } from 'src/common/decorators/filter.decorator';

@Injectable()
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @QueryList(Transaction)
  async transactions(
    @CurrentUser() user: JwtPayload['user'],
    @Filters() filters: GetTransactionInput,
    @Pagination() pagination: Pagination,
    @FieldMap('transactions.data') fieldMap: FieldMap,
  ) {
    const { data, total } = await this.transactionService.getTransactions(
      user.id,
      filters,
      pagination,
      fieldMap,
    );

    return {
      data,
      total,
      message: 'Transactions fetched successfully',
    };
  }

  @AppMutation(Transaction)
  async createTransaction(
    @CurrentUser() user: JwtPayload['user'],
    @Input() input: CreateTransactionInput,
    @FieldMap('createTransaction.data') fieldMap: FieldMap,
  ) {
    const transaction = await this.transactionService.createTransaction(
      user.id,
      input,
      fieldMap,
    );

    return {
      data: transaction,
      message: 'Transaction created successfully',
      statusCode: 200,
    };
  }

  @AppMutation(Transaction)
  async updateTransaction(
    @CurrentUser() user: JwtPayload['user'],
    @Input() input: UpdateTransactionInput,
    @FieldMap('updateTransaction.data') fieldMap: FieldMap,
  ) {
    const transaction = await this.transactionService.updateTransaction(
      user.id,
      input,
      fieldMap,
    );

    return {
      data: transaction,
      message: 'Transaction updated successfully',
      statusCode: 200,
    };
  }
}

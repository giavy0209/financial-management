import { Resolver } from '@nestjs/graphql';
import { MoneySourceService } from './money-source.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  AppMutation,
  QueryList,
} from 'src/common/decorators/resolvers.decorator';
import { MoneySource } from './money-source.type';
import { FieldMap } from 'src/common/decorators/field-map.decorator';
import { Input } from 'src/common/decorators/input.decorator';
import { CreateMoneySourceInput } from './input/create-money-source.input';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { UpdateMoneySourceInput } from './input/update-money-source.input';
import { DeleteMoneySourceInput } from './input/delete-money-source.input';

@Resolver('MoneySource')
export class MoneySourceResolver {
  constructor(private readonly moneySourceService: MoneySourceService) {}

  @QueryList(MoneySource)
  async moneySources(
    @FieldMap('moneySources.data') fieldMap: FieldMap,
    @CurrentUser() user: JwtPayload['user'],
    @Pagination() pagination: Pagination,
  ) {
    const { data, total } = await this.moneySourceService.getMoneySources(
      user.id,
      pagination,
      fieldMap,
    );
    return {
      data,
      total,
      message: 'Money sources fetched successfully',
    };
  }

  @AppMutation(MoneySource)
  async createMoneySource(
    @Input() input: CreateMoneySourceInput,
    @CurrentUser() user: JwtPayload['user'],
    @FieldMap('createMoneySource.data') fieldMap: FieldMap,
  ) {
    const data = await this.moneySourceService.createMoneySource(
      user.id,
      input,
      fieldMap,
    );
    return {
      data,
      message: 'Money source created successfully',
    };
  }

  @AppMutation(MoneySource)
  async updateMoneySource(
    @Input() input: UpdateMoneySourceInput,
    @CurrentUser() user: JwtPayload['user'],
    @FieldMap('updateMoneySource.data') fieldMap: FieldMap,
  ) {
    const data = await this.moneySourceService.updateMoneySource(
      user.id,
      input,
      fieldMap,
    );
    return {
      data,
      message: 'Money source updated successfully',
    };
  }

  @AppMutation(Boolean)
  async deleteMoneySource(
    @Input() input: DeleteMoneySourceInput,
    @CurrentUser() user: JwtPayload['user'],
  ) {
    await this.moneySourceService.deleteMoneySource(user.id, input.id);
    return {
      data: true,
      message: 'Money source deleted successfully',
    };
  }
}

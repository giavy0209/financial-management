import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/category/category.type';
import { MoneySource } from 'src/money-source/money-source.type';

@ObjectType()
export class Transaction {
  @Field(() => Int)
  id: number;

  @Field(() => Float)
  amount: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => MoneySource)
  moneySource: MoneySource;

  @Field(() => Category)
  category: Category;

  @Field(() => Date)
  createdAt: Date;
}

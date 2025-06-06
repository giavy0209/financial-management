import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Transaction } from 'src/transaction/transaction.type';

@ObjectType()
export class Category {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => [Transaction])
  transactions: Transaction[];
}

import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Transaction } from 'src/transaction/transaction.type';

@ObjectType()
export class MoneySource {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => [Transaction], { nullable: true })
  transactions?: Transaction[];

  @Field(() => Float)
  value: number;

  @Field(() => Date)
  createdAt: Date;
}

import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/category/category.type';

@ObjectType()
export class Transaction {
  @Field(() => Int)
  id: number;

  @Field(() => Float)
  amount: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Category)
  category: Category;

  @Field(() => Date)
  createdAt: Date;
}

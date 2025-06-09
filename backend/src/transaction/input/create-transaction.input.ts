import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field(() => Float)
  @IsNumber()
  amount: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Int)
  @IsInt()
  categoryId: number;

  @Field(() => Int)
  @IsInt()
  moneySourceId: number;

  @Field(() => Date)
  @IsDate()
  createdAt: Date;
}

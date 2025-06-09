import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteMoneySourceInput {
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  id: number;
}

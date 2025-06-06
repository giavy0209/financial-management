import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteCategoryInput {
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  id: number;
}

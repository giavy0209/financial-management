import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;
}

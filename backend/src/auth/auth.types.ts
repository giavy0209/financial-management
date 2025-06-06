import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Category } from 'src/category/category.type';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Category])
  categories: Category[];
}

@ObjectType()
export class Signup {
  @Field()
  success: boolean;
}

@ObjectType()
export class Login {
  @Field()
  token: string;

  @Field(() => User)
  user: User;
}

import { Field, ObjectType, Int } from '@nestjs/graphql';

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

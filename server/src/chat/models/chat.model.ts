import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'chat ' })
export class Chat {
  @Field((type) => ID)
  id: string;

  @Field()
  message: string;

  @Field()
  sentBy: string;

  @Field()
  sentTo: string;

  @Field()
  creationDate: Date;
}

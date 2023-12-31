import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class NewChatInput {
  @Field()
  @MaxLength(30)
  message: string;

  @Field()
  sentBy: string;

  @Field()
  sentTo: string;
}

import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class NewChatInput {
  @Field()
  @MaxLength(4096)
  @IsOptional()
  message: string;

  @Field()
  status: string;

  @Field()
  channelId: string;

  @Field()
  sentByUserId: string;

  @Field()
  sentToUserId: string;
}

@InputType()
export class ChatQueryInput {
  @Field()
  channelId: string;
}

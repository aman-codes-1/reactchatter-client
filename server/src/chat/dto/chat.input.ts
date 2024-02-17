import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class NewChatInput {
  @Field()
  channelId: string;

  @Field()
  @MaxLength(4096)
  @IsOptional()
  message: string;

  @Field()
  sentByUserId: string;

  @Field()
  sentToUserId: string;

  @Field()
  status: string;

  @Field()
  timestamp: number;
}

@InputType()
export class ChatQueryInput {
  @Field()
  channelId: string;
}

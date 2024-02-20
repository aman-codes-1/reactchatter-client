import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType({ description: 'newChatInput' })
export class NewChatInput {
  @Field((type) => String)
  channelId: string;

  @Field((type) => String)
  @MaxLength(4096)
  @IsOptional()
  message: string;

  @Field((type) => String)
  sentByUserId: string;

  @Field((type) => String)
  sentToUserId: string;

  @Field((type) => String)
  status: string;

  @Field((type) => Int)
  timestamp: number;
}

@InputType({ description: 'chatsInput' })
export class ChatsInput {
  @Field((type) => String)
  channelId: string;
}

import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'chat' })
export class Chat {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  channelId: string;

  @Field(() => String)
  message: string;

  @Field(() => String)
  sentByUserId: string;

  @Field(() => String)
  sentToUserId: string;

  @Field(() => String)
  sentDateLong: string;

  @Field(() => String)
  sentDateShort: string;

  @Field(() => String)
  status: string;

  @Field(() => Number)
  timestamp: number;
}

@ObjectType({ description: 'chatData' })
export class ChatData {
  @Field(() => String)
  channelId: string;

  @Field()
  data: Chat;
}

@ObjectType({ description: 'chatsData' })
export class ChatsData {
  @Field(() => String)
  channelId: string;

  @Field(() => [Chat])
  data: Chat[];
}

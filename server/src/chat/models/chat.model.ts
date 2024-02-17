import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'chat' })
export class Chat {
  @Field()
  _id: string;

  @Field()
  channelId: string;

  @Field()
  message: string;

  @Field()
  sentByUserId: string;

  @Field()
  sentToUserId: string;

  @Field()
  sentDateLong: string;

  @Field()
  sentDateShort: string;

  @Field()
  status: string;

  @Field()
  timestamp: number;
}

@ObjectType({ description: 'chatData' })
export class ChatData {
  @Field()
  channelId: string;

  @Field()
  data: Chat;
}

@ObjectType({ description: 'chatsData' })
export class ChatsData {
  @Field()
  channelId: string;

  @Field()
  data: Chat[];
}

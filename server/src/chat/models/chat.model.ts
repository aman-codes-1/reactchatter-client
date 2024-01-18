import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'chat' })
export class Chat {
  @Field()
  _id: string;

  @Field()
  message: string;

  @Field()
  status: string;

  @Field()
  channelId: string;

  @Field()
  sentByUserId: string;

  @Field()
  sentToUserId: string;

  @Field()
  creationDateShort: string;

  @Field()
  creationDateLong: string;
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

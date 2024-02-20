import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'chat' })
export class Chat {
  @Field((type) => String)
  _id: string;

  @Field((type) => String)
  channelId: string;

  @Field((type) => String)
  message: string;

  @Field((type) => String)
  sentByUserId: string;

  @Field((type) => String)
  sentToUserId: string;

  @Field((type) => String)
  sentDateLong: string;

  @Field((type) => String)
  sentDateShort: string;

  @Field((type) => String)
  status: string;

  @Field((type) => Int)
  timestamp: number;
}

@ObjectType({ description: 'chatData' })
export class ChatData {
  @Field((type) => String)
  channelId: string;

  @Field((type) => Chat)
  data: Chat;
}

@ObjectType({ description: 'chatsData' })
export class ChatsData {
  @Field((type) => String)
  channelId: string;

  @Field((type) => [Chat])
  data: Chat[];
}

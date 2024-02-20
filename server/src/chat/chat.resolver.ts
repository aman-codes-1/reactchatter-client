import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ChatsInput, NewChatInput } from './dto/chat.input';
import { ChatArgs } from './dto/chat.args';
import { Chat, ChatData, ChatsData } from './models/chat.model';
import { ChatService } from './chat.service';
import { Chat as Chats } from './chat.schema';

const pubSub = new PubSub();

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly ChatServices: ChatService) {
    //
  }

  @Query((returns) => Chat)
  async chat(@Args('id') id: string): Promise<Chat> {
    const chat = await this.ChatServices.findOneById(id);
    if (!chat) {
      throw new NotFoundException(id);
    }
    return chat;
  }

  @Query((returns) => [Chat])
  async chats(
    @Args('chatData') chatData: ChatsInput,
    @Args() chatArgs: ChatArgs,
  ): Promise<Chat[]> {
    const chats = await this.ChatServices.findAll(chatData, chatArgs);
    return chats;
  }

  @Mutation((returns) => Chat)
  async newChat(
    @Args('chatData') chatData: NewChatInput,
    @Args() chatArgs: ChatArgs,
  ): Promise<any> {
    const { channelId } = chatData;
    const newChat = await this.ChatServices.create(chatData);
    const chats = await this.ChatServices.findAll(chatData, chatArgs);
    pubSub.publish('chatAdded', {
      chatAdded: {
        channelId,
        data: newChat,
      },
    });
    pubSub.publish('chatUpdated', {
      chatUpdated: {
        channelId,
        data: chats,
      },
    });
    return newChat;
  }

  @Mutation((returns) => Boolean)
  async removeChat(@Args('id') id: string) {
    return this.ChatServices.remove(id);
  }

  @Subscription((returns) => ChatData)
  chatAdded() {
    return pubSub.asyncIterator('chatAdded');
  }

  @Subscription((returns) => ChatsData)
  chatUpdated() {
    return pubSub.asyncIterator('chatUpdated');
  }
}

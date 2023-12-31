import { NotFoundException } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { NewChatInput } from './dto/new-chat.input';
import { ChatArgs } from './dto/chat.args';
import { Chat } from './models/chat.model';
import { ChatService } from './chat.service';

const pubSub = new PubSub();

@Resolver((of: any) => Chat)
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
  chats(@Args() chatArgs: ChatArgs): Promise<Chat[]> {
    return this.ChatServices.findAll(chatArgs);
  }

  @Mutation((returns) => Chat)
  async newChat(@Args('newChatData') newChatData: NewChatInput): Promise<Chat> {
    const chat = await this.ChatServices.create(newChatData);
    pubSub.publish('chatAdded', { chatAdded: chat });
    return chat;
  }

  @Mutation((returns) => Boolean)
  async removeChat(@Args('id') id: string) {
    return this.ChatServices.remove(id);
  }

  @Subscription((returns) => Chat)
  chatAdded() {
    return pubSub.asyncIterator('chatAdded');
  }
}

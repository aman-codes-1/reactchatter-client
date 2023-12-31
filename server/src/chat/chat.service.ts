import { Injectable } from '@nestjs/common';
import { NewChatInput } from './dto/new-chat.input';
import { ChatArgs } from './dto/chat.args';
import { Chat } from './models/chat.model';

@Injectable()
export class ChatService {
  async create(data: NewChatInput): Promise<Chat> {
    return {} as any;
  }

  async findOneById(id: string): Promise<Chat> {
    return {} as any;
  }

  async findAll(chatArgs: ChatArgs): Promise<Chat[]> {
    return [] as Chat[];
  }

  async remove(id: string): Promise<boolean> {
    return true;
  }
}

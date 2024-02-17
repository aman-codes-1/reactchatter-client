import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { ChatQueryInput, NewChatInput } from './dto/chat.input';
import { ChatArgs } from './dto/chat.args';
import { Chat } from './models/chat.model';
import { Chat as Chats, ChatDocument } from './chat.schema';
import { Friend, FriendDocument } from '../friend/friend.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chats.name) private ChatModel: Model<ChatDocument>,
    @InjectModel(Friend.name) private FriendModel: Model<FriendDocument>,
  ) {
    //
  }

  async create(data: NewChatInput): Promise<Chats> {
    const { channelId, sentByUserId, sentToUserId, timestamp } = data;
    const channelObjectId = new ObjectId(channelId);
    const sentByUserObjectId = new ObjectId(sentByUserId);
    const sentToUserObjectId = new ObjectId(sentToUserId);
    const friend = await this.FriendModel.findOne({
      $or: [
        {
          $and: [
            { _id: channelObjectId },
            { addedByUserId: sentByUserObjectId },
            { userId: sentToUserObjectId },
          ],
        },
        {
          $and: [
            { _id: channelObjectId },
            { addedByUserId: sentToUserObjectId },
            { userId: sentByUserObjectId },
          ],
        },
      ],
    }).lean();
    if (!friend) {
      throw new BadRequestException('Channel not found.');
    }
    const newChatData = {
      ...data,
      sentDateLong: new Date(timestamp).toLocaleTimeString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hourCycle: 'h12',
      }),
      sentDateShort: new Date(timestamp).toLocaleTimeString('en-GB', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h12',
      }),
    };
    const newChat = new this.ChatModel(newChatData);
    await newChat.save();
    return newChat?._doc ? newChat?._doc : newChat;
  }

  async findOneById(id: string): Promise<Chat> {
    return {} as any;
  }

  async findAll(data: ChatQueryInput, chatArgs: ChatArgs): Promise<Chat[]> {
    const { channelId } = data;
    const channelObjectId = new ObjectId(channelId);
    const { limit, skip } = chatArgs;
    const chats = await this.ChatModel.find({ channelId: channelObjectId })
      .limit(limit)
      .skip(skip)
      .sort({ $natural: -1 })
      .lean();
    return chats.reverse() as unknown as Chat[];
  }

  async remove(id: string): Promise<boolean> {
    return true;
  }
}

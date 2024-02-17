import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

class DocumentResult<T> {
  _doc: T;
}

@Schema()
export class Chat extends DocumentResult<Chat> {
  @Prop()
  channelId: MongooseSchema.Types.ObjectId;

  @Prop()
  message: string;

  @Prop()
  sentByUserId: MongooseSchema.Types.ObjectId;

  @Prop()
  sentToUserId: MongooseSchema.Types.ObjectId;

  @Prop()
  sentDateLong: string;

  @Prop()
  sentDateShort: string;

  @Prop()
  status: string;

  @Prop()
  timestamp: number;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
export type ChatDocument = Chat & Document;

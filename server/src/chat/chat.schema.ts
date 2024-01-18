import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

class DocumentResult<T> {
  _doc: T;
}

@Schema()
export class Chat extends DocumentResult<Chat> {
  @Prop()
  message: string;

  @Prop()
  status: string;

  @Prop()
  channelId: MongooseSchema.Types.ObjectId;

  @Prop()
  sentByUserId: MongooseSchema.Types.ObjectId;

  @Prop()
  sentToUserId: MongooseSchema.Types.ObjectId;

  @Prop()
  creationDateShort: string;

  @Prop()
  creationDateLong: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
export type ChatDocument = Chat & Document;

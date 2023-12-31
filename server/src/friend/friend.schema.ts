import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

class DocumentResult<T> {
  _doc: T;
}

@Schema()
export class Friend extends DocumentResult<Friend> {
  @Prop()
  userId: MongooseSchema.Types.ObjectId;

  @Prop()
  addedByUserId: MongooseSchema.Types.ObjectId;

  @Prop()
  isFriend: boolean;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
export type FriendDocument = Friend & Document;

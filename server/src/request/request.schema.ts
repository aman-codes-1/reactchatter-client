import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

class DocumentResult<T> {
  _doc: T;
}

@Schema()
export class Request extends DocumentResult<Request> {
  @Prop()
  sentToUserId: MongooseSchema.Types.ObjectId;

  @Prop()
  sentByUserId: MongooseSchema.Types.ObjectId;

  @Prop()
  status: string;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
export type RequestDocument = Request & Document;

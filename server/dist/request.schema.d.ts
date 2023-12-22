/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document, Schema as MongooseSchema } from "mongoose";
declare class DocumentResult<T> {
    _doc: T;
}
export declare class Request extends DocumentResult<Request> {
    sentToUserId: MongooseSchema.Types.ObjectId;
    sentByUserId: MongooseSchema.Types.ObjectId;
    status: string;
}
export declare const RequestSchema: MongooseSchema<Request, import("mongoose").Model<Request, any, any, any, Document<unknown, any, Request> & Request & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Request, Document<unknown, {}, import("mongoose").FlatRecord<Request>> & import("mongoose").FlatRecord<Request> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export type RequestDocument = Request & Document;
export {};

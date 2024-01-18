import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class ChatInput {
  @Field({ nullable: true })
  @MaxLength(4096)
  @IsOptional()
  message: string;

  @Field({ nullable: true })
  status: string;

  @Field()
  channelId: string;

  @Field({ nullable: true })
  sentByUserId: string;

  @Field({ nullable: true })
  sentToUserId: string;
}

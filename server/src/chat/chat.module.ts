import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DateScalar } from '../common/scalars/date.scalar';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      subscriptions: {
        'graphql-ws': true,
      },
      playground: true,
    }),
  ],
  providers: [ChatResolver, ChatService, DateScalar],
})
export class ChatModule {}

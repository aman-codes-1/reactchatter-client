import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PusherController } from './pusher.controller';
import { PusherService } from './pusher.service';

@Module({
  controllers: [PusherController],
  providers: [PusherService],
})
export class PusherModule {}

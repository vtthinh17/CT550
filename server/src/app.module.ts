/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PusherService } from './pusher/pusher.service';
@Module({
  imports: [
    PostsModule, 
    UsersModule,
    NotificationsModule, 
    MongooseModule.forRoot('mongodb://localhost:27017/CT550'),
  ],
  providers: [PusherService],
})
export class AppModule {}

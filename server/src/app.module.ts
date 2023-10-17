/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
@Module({
  imports: [
    PostsModule, 
    UsersModule,
    NotificationsModule, 
    MongooseModule.forRoot('mongodb://localhost:27017/CT550'),
  ],
})
export class AppModule {}

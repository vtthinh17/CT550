import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';
import { PostSchema } from './models/post.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PusherService } from 'src/pusher/pusher.service';
@Module({
  controllers: [PostsController],
  providers: [PostsService, PusherService],
  imports: [
    UsersModule,
    NotificationsModule,
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
  ],
  exports: [PostsService],
})
export class PostsModule {}

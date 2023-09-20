import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';
import { PostSchema } from './models/post.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
  ],
})
export class PostsModule {}

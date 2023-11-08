import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UserSchema } from './models/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from 'src/posts/posts.module';
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    forwardRef(() => PostsModule),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  exports: [UsersService],
})
export class UsersModule {}

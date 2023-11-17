import { Module } from '@nestjs/common';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifySchema } from './models/notifications.model';
import { UsersModule } from 'src/users/users.module';
import { PusherService } from 'src/pusher/pusher.service';
@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, PusherService],
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: 'Notify', schema: NotifySchema }]),
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}

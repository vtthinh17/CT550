import { Module } from '@nestjs/common';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifySchema } from './models/notifications.model';
import { UsersModule } from 'src/users/users.module';
@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: 'Notify', schema: NotifySchema }]),
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}

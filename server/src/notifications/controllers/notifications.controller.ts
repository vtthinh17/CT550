import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { CreateNotifyDto } from '../dto/notify.dto';
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifyService: NotificationsService) {}
  @Post('create')
  async createNotify(@Body() createNotifyDto: CreateNotifyDto) {
    return this.notifyService.createNewNotify(createNotifyDto);
  }
  @Put('markSeenAllNotifies')
  async markSeen(@Body() data: Array<object>) {
    return this.notifyService.markSeenNotify(data);
  }
  @Get('getUnseenNotifies/:userId')
  async getUnseenNotifies(@Param('userId') userId: string) {
    return this.notifyService.getUserNotify(userId);
  }
}

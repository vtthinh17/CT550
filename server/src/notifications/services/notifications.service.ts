import { Injectable } from '@nestjs/common';
import { Notify } from '../interfaces/notifycation.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotifyDto } from '../dto/notify.dto';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('Notify') private readonly notifyModel: Model<Notify>,
    private readonly userService: UsersService,
  ) {}
  async createNewNotify(createNotifyDto: CreateNotifyDto): Promise<Notify> {
    try {
      const newPost = new this.notifyModel({
        fromUserID: createNotifyDto.fromUserID,
        toUserID: createNotifyDto.toUserID,
        action: createNotifyDto.action,
        timeAt: new Date().getTime(),
      });
      if (createNotifyDto.action == 'follow') {
        this.userService.follow(
          createNotifyDto.fromUserID,
          createNotifyDto.toUserID,
        );
      }
      return await newPost.save();
    } catch (error) {
      console.log(error);
    }
  }
  async getUserNotify(userId: string) {
    return this.notifyModel
      .find({ toUserID: userId, isViewed: false })
      .then((notify) => {
        return notify;
      })
      .catch((err) => console.log(err));
  }
  async markSeenNotify(data) {
    console.log(data);

    return this.notifyModel.updateMany(
      { _id: { $in: data } },
      { $set: { isViewed: true } },
    );
  }
  async sendNotiToSubScriber(companyId: string) {
    const user = await this.userService.getUser(companyId);
    user.subscriber.forEach(async (followerId) => {
      const newPost = new this.notifyModel({
        fromUserID: companyId,
        toUserID: followerId,
        action: 'newPost',
        timeAt: new Date().getTime(),
      });
      await newPost.save();
      console.log('send notify to:', followerId);
    });
    console.log('END OF NOTI SUB');
  }
}

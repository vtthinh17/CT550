import { Injectable } from '@nestjs/common';
import { Notify } from '../interfaces/notifycation.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotifyDto } from '../dto/notify.dto';
import { UsersService } from 'src/users/services/users.service';
import { PusherService } from 'src/pusher/pusher.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('Notify') private readonly notifyModel: Model<Notify>,
    private readonly userService: UsersService,
    private readonly pusherService: PusherService,
  ) {}
  async createNewNotify(createNotifyDto: CreateNotifyDto): Promise<Notify> {
    try {
      const d = new Date();
      const datetext =
        d.getHours() +
        ':' +
        (d.getMinutes() > 10 ? d.getMinutes() : '0' + d.getMinutes()) +
        ':' +
        (d.getSeconds() > 10 ? d.getSeconds() : '0' + d.getSeconds()) +
        ', ' +
        (d.getDate() > 10 ? d.getDate() : '0' + d.getDate()) +
        '/' +
        (d.getMonth() + 1 > 10 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
        '/' +
        d.getFullYear();
      let newPost;
      if (createNotifyDto.action == 'newPost') {
        newPost = new this.notifyModel({
          fromUserID: createNotifyDto.fromUserID,
          toUserID: createNotifyDto.toUserID,
          postID: createNotifyDto.postID,
          action: createNotifyDto.action,
          timeAt: datetext,
        });
      } else if (createNotifyDto.action == 'applyJob') {
        newPost = new this.notifyModel({
          fromUserID: createNotifyDto.fromUserID,
          toUserID: createNotifyDto.toUserID,
          postID: createNotifyDto.postID,
          action: createNotifyDto.action,
          timeAt: datetext,
        });
      } else {
        newPost = new this.notifyModel({
          fromUserID: createNotifyDto.fromUserID,
          toUserID: createNotifyDto.toUserID,
          action: createNotifyDto.action,
          timeAt: datetext,
        });
      }
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
      .find({
        toUserID: userId,
      })
      .then((notify) => {
        return notify;
      })
      .catch((err) => console.log(err));
  }
  async markSeenNotify(data) {
    return this.notifyModel.updateMany(
      { _id: { $in: data } },
      { $set: { isViewed: true } },
    );
  }
  async sendNotiToSubScriber(companyId: string, postID: string) {
    const user = await this.userService.getUser(companyId);
    const d = new Date();
    const datetext =
      d.getHours() +
      ':' +
      (d.getMinutes() > 10 ? d.getMinutes() : '0' + d.getMinutes()) +
      ':' +
      (d.getSeconds() > 10 ? d.getSeconds() : '0' + d.getSeconds()) +
      ', ' +
      (d.getDate() > 10 ? d.getDate() : '0' + d.getDate()) +
      '/' +
      (d.getMonth() + 1 > 10 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
      '/' +
      d.getFullYear();
    user.subscriber.forEach(async (followerId) => {
      const newPost = new this.notifyModel({
        fromUserID: companyId,
        toUserID: followerId,
        postID: postID,
        action: 'newPost',
        timeAt: datetext,
      });
      // tạo thông báo
      await newPost.save();
      // trigger realtime notify
      await this.pusherService.trigger(
        'recruitment-system',
        `newPost-${followerId}`,
        'trigger Notify SubScribers',
      );
    });
  }
  async sendNotiApprovedPostToCompany(
    companyId: string,
    postId: string,
  ): Promise<Notify> {
    try {
      const d = new Date();
      const datetext =
        d.getHours() +
        ':' +
        (d.getMinutes() > 10 ? d.getMinutes() : '0' + d.getMinutes()) +
        ':' +
        (d.getSeconds() > 10 ? d.getSeconds() : '0' + d.getSeconds()) +
        ', ' +
        (d.getDate() > 10 ? d.getDate() : '0' + d.getDate()) +
        '/' +
        (d.getMonth() + 1 > 10 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
        '/' +
        d.getFullYear();
      const newPost = new this.notifyModel({
        toUserID: companyId,
        postID: postId,
        action: 'approvePost',
        timeAt: datetext,
      });
      return await newPost.save();
    } catch (error) {
      console.log(error);
    }
  }
}

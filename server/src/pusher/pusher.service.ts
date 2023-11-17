import { Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';
@Injectable()
export class PusherService {
  pusher: Pusher;
  constructor() {
    this.pusher = new Pusher({
      appId: '1708619',
      key: '9890890cdd6b6d94db8d',
      secret: 'a949269fd3ac00148e72',
      cluster: 'ap1',
      useTLS: true,
    });
  }
  async trigger(channel: string, event: string, data: any) {
    await this.pusher.trigger(channel, event, data);
  }
}

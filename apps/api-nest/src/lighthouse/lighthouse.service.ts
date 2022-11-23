import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bull';

@Injectable()
export class LighthouseService {
  constructor(@InjectQueue('lighthouse') private lighthouse: Queue) {}

  async publish() {
    await this.lighthouse.add('lighthouse', {
      ok: true,
    });
  }
}

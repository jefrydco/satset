import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueNameEnum } from 'src/app.enum';
import { Browser } from './browser';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueNameEnum.BROWSER,
    }),
    BullModule.registerQueue({
      name: QueueNameEnum.LIGHTHOUSE,
    }),
  ],
  providers: [Browser],
  exports: [Browser],
})
export class BrowserModule {}

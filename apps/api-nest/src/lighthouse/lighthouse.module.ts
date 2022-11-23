import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { LighthouseController } from './lighthouse.controller';
import { LighthouseService } from './lighthouse.service';
import { Lighthouse } from './lighthouse';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'lighthouse',
    }),
  ],
  controllers: [LighthouseController],
  providers: [LighthouseService, Lighthouse],
})
export class LighthouseModule {}

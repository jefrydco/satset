import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueNameEnum } from 'src/app.enum';
import { Measure, MeasureSchema } from 'src/lighthouse/lighthouse.schema';
import { Browser } from './browser';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueNameEnum.BROWSER,
    }),
    BullModule.registerQueue({
      name: QueueNameEnum.LIGHTHOUSE,
    }),
    MongooseModule.forFeature([{ name: Measure.name, schema: MeasureSchema }]),
  ],
  providers: [Browser],
  exports: [Browser],
})
export class BrowserModule {}

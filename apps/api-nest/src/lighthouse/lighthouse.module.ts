import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueNameEnum } from 'src/app.enum';
import { BrowserModule } from 'src/browser/browser.module';
import { Lighthouse } from './lighthouse';
import {
  Measure,
  MeasureSchema,
  Score,
  ScoreSchema,
} from './lighthouse.schema';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueNameEnum.LIGHTHOUSE,
    }),
    MongooseModule.forFeature([{ name: Measure.name, schema: MeasureSchema }]),
    MongooseModule.forFeature([{ name: Score.name, schema: ScoreSchema }]),
    BrowserModule,
  ],
  providers: [Lighthouse],
})
export class LighthouseModule {}

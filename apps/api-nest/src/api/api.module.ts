import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { Api } from './api';
import { QueueNameEnum } from 'src/app.enum';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Measure,
  MeasureSchema,
  Score,
  ScoreSchema,
} from 'src/lighthouse/lighthouse.schema';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueNameEnum.API,
    }),
    BullModule.registerQueue({
      name: QueueNameEnum.BROWSER,
    }),
    BullModule.registerQueue({
      name: QueueNameEnum.LIGHTHOUSE,
    }),
    MongooseModule.forFeature([{ name: Measure.name, schema: MeasureSchema }]),
    MongooseModule.forFeature([{ name: Score.name, schema: ScoreSchema }]),
  ],
  controllers: [ApiController],
  providers: [ApiService, Api],
})
export class ApiModule {}

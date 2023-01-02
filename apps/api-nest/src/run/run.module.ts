import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { RunController } from './run.controller';
import { RunService } from './run.service';
import { Run } from './run';
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
      name: QueueNameEnum.RUN,
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
  controllers: [RunController],
  providers: [RunService, Run],
})
export class RunModule {}

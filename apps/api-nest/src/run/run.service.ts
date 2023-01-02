import { InjectQueue } from '@nestjs/bull';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { FunctionExecutionStateEnum, QueueNameEnum } from 'src/app.enum';
import { RunJobNameEnum } from './run.enum';
import {
  PublishRunPayloadDto,
  RunListRequestPayloadDto,
  RunRequestPayloadDto,
  RunStatusRequestPayloadDto,
} from './run.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Measure, Score } from 'src/lighthouse/lighthouse.schema';

@Injectable()
export class RunService extends ConsoleLogger {
  constructor(
    @InjectQueue(QueueNameEnum.RUN) private runQueue: Queue,
    @InjectModel(Measure.name) private measureModel: Model<Measure>,
    @InjectModel(Score.name) private scoreModel: Model<Score>,
  ) {
    super(RunService.name);
  }

  async getMeasures(runListRequestPayloadDto: RunListRequestPayloadDto) {
    try {
      this.log(`${this.getMeasure.name} ${FunctionExecutionStateEnum.START}`);
      const limit = runListRequestPayloadDto.limit
        ? Number.parseInt(runListRequestPayloadDto.limit)
        : 10;
      const page = runListRequestPayloadDto.page
        ? Number.parseInt(runListRequestPayloadDto.page)
        : 1;
      this.log({ limit, page });
      const measureDocuments = await this.measureModel
        .find()
        .populate(['scores'])
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const countDocuments = this.measureModel.count();
      return {
        measureDocuments,
        countDocuments,
      };
    } catch (error) {
      this.error(error);
    }
    this.log(`${this.getMeasure.name} ${FunctionExecutionStateEnum.END}`);
  }

  async getMeasure(runStatusRequestPayloadDto: RunStatusRequestPayloadDto) {
    try {
      this.log(`${this.getMeasure.name} ${FunctionExecutionStateEnum.START}`);
      const measureDocument = await this.measureModel
        .findById(runStatusRequestPayloadDto.measureMongoId)
        .populate(['scores']);
      return measureDocument?.toJSON();
    } catch (error) {
      this.error(error);
    }
    this.log(`${this.getMeasure.name} ${FunctionExecutionStateEnum.END}`);
  }

  async storeMeasure(runRequestPayloadDto: RunRequestPayloadDto) {
    this.log(`${this.storeMeasure.name} ${FunctionExecutionStateEnum.START}`);
    try {
      const createdMeasure = new this.measureModel({
        measureName: runRequestPayloadDto.name,
        scores: [],
        startAt: new Date(),
      });
      return createdMeasure.save();
    } catch (error) {
      this.error(error);
    }
    this.log(`${this.storeMeasure.name} ${FunctionExecutionStateEnum.END}`);
  }

  async publishRun(publishRunPayload: PublishRunPayloadDto) {
    this.log(`${this.publishRun.name} ${FunctionExecutionStateEnum.START}`);
    try {
      await this.runQueue.add(RunJobNameEnum.RUN, publishRunPayload);
    } catch (error) {
      this.error(error);
    }
    this.log(`${this.publishRun.name} ${FunctionExecutionStateEnum.END}`);
  }
}

import { InjectQueue } from '@nestjs/bull';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { FunctionExecutionStateEnum, QueueNameEnum } from 'src/app.enum';
import { ApiJobNameEnum } from './api.enum';
import {
  PublishRunPayloadDto,
  RunRequestPayloadDto,
  RunStatusRequestPayloadDto,
} from './api.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Measure, Score } from 'src/lighthouse/lighthouse.schema';

@Injectable()
export class ApiService extends ConsoleLogger {
  constructor(
    @InjectQueue(QueueNameEnum.API) private apiQueue: Queue,
    @InjectModel(Measure.name) private measureModel: Model<Measure>,
    @InjectModel(Score.name) private scoreModel: Model<Score>,
  ) {
    super(ApiService.name);
  }

  async getMeasure(runStatusRequestPayloadDto: RunStatusRequestPayloadDto) {
    try {
      this.log(`${this.getMeasure.name} ${FunctionExecutionStateEnum.START}`);
      const measureDocument = await this.measureModel
        .findById(runStatusRequestPayloadDto.measureMongoId)
        .populate('scores');
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
      await this.apiQueue.add(ApiJobNameEnum.RUN, publishRunPayload);
    } catch (error) {
      this.error(error);
    }
    this.log(`${this.publishRun.name} ${FunctionExecutionStateEnum.END}`);
  }
}

import { InjectQueue } from '@nestjs/bull';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { FunctionExecutionStateEnum, QueueNameEnum } from 'src/app.enum';
import { ApiJobNameEnum } from './api.enum';
import { PublishRunPayloadDto } from './api.dto';

@Injectable()
export class ApiService extends ConsoleLogger {
  constructor(@InjectQueue(QueueNameEnum.API) private apiQueue: Queue) {
    super(ApiService.name);
  }

  async publishRun(publishRunPayload: PublishRunPayloadDto) {
    this.log(`${this.publishRun.name} ${FunctionExecutionStateEnum.START}`);
    await this.apiQueue.add(ApiJobNameEnum.RUN, publishRunPayload);
    this.log(`${this.publishRun.name} ${FunctionExecutionStateEnum.END}`);
  }
}

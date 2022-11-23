import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { FunctionExecutionStateEnum, QueueNameEnum } from 'src/app.enum';
import { ApiJobNameEnum } from './api.enum';
import { PublishRunPayloadDto } from './api.dto';
import { BrowserJobName } from 'src/browser/browser.enum';
import { WORKER_CONCURRENCY } from 'src/app.constant';

@Injectable()
@Processor(QueueNameEnum.API)
export class Api extends ConsoleLogger {
  constructor(
    @InjectQueue(QueueNameEnum.BROWSER)
    private browserQueue: Queue<PublishRunPayloadDto>,
  ) {
    super(Api.name);
  }

  @Process({ name: ApiJobNameEnum.RUN, concurrency: WORKER_CONCURRENCY })
  async consumerRun(job: Job<PublishRunPayloadDto>) {
    this.log(`${this.consumerRun.name} ${FunctionExecutionStateEnum.START}`);
    await this.browserQueue.add(BrowserJobName.LOGIN, job.data);
    this.log(`${this.consumerRun.name} ${FunctionExecutionStateEnum.END}`);
  }

  // @OnQueueActive()
  // onActive(job: Job<PublishRunPayloadDto>) {}
}
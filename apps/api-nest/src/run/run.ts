import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { FunctionExecutionStateEnum, QueueNameEnum } from 'src/app.enum';
import { RunJobNameEnum } from './run.enum';
import { PublishRunPayloadDto } from './run.dto';
import { BrowserJobName } from 'src/browser/browser.enum';
import { WORKER_CONCURRENCY } from 'src/app.constant';
import { LoginDto } from 'src/browser/browser.dto';

@Injectable()
@Processor(QueueNameEnum.RUN)
export class Run extends ConsoleLogger {
  constructor(
    @InjectQueue(QueueNameEnum.BROWSER)
    private browserQueue: Queue<LoginDto>,
  ) {
    super(Run.name);
  }

  @Process({ name: RunJobNameEnum.RUN, concurrency: WORKER_CONCURRENCY })
  async consumerRun(job: Job<PublishRunPayloadDto>) {
    this.log(`${this.consumerRun.name} ${FunctionExecutionStateEnum.START}`);
    try {
      await this.browserQueue.add(BrowserJobName.LOGIN, job.data);
    } catch (error) {
      this.error(error);
    }
    this.log(`${this.consumerRun.name} ${FunctionExecutionStateEnum.END}`);
  }

  // @OnQueueActive()
  // onActive(job: Job<PublishRunPayloadDto>) {}
}

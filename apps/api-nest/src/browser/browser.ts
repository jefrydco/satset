import { InjectQueue, Process } from '@nestjs/bull';
import { Processor } from '@nestjs/bull';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job, Queue } from 'bull';
import { Model } from 'mongoose';
import puppeteer from 'puppeteer';
import { PublishRunPayloadDto } from 'src/api/api.dto';
import { PUPPETEER_PORT, WORKER_CONCURRENCY } from 'src/app.constant';
import { FunctionExecutionStateEnum, QueueNameEnum } from 'src/app.enum';
import { MeasureDto } from 'src/lighthouse/lighthouse.dto';
import { LighthouseJobNameEnum } from 'src/lighthouse/lighthouse.enum';
import { Measure } from 'src/lighthouse/lighthouse.schema';
import { BrowserJobName } from './browser.enum';

@Injectable()
@Processor(QueueNameEnum.BROWSER)
export class Browser extends ConsoleLogger {
  browser: puppeteer.Browser;
  constructor(
    @InjectQueue(QueueNameEnum.LIGHTHOUSE)
    private lighthouseQueue: Queue<MeasureDto>,
    @InjectModel(Measure.name) private measureModel: Model<Measure>,
  ) {
    super(Browser.name);
  }
  public async initBrowser() {
    this.browser = await puppeteer.launch({
      args: [`--remote-debugging-port=${PUPPETEER_PORT}`],
      headless: false,
      slowMo: 50,
      defaultViewport: null,
    });
  }
  @Process({ name: BrowserJobName.LOGIN, concurrency: WORKER_CONCURRENCY })
  async consumerLogin(job: Job<PublishRunPayloadDto>) {
    this.log(`${this.consumerLogin.name} ${FunctionExecutionStateEnum.START}`);
    try {
      const createdMeasure = new this.measureModel({
        name: job.data.name,
        scores: [],
      });
      this.log(await createdMeasure.save());
      await this.initBrowser();
      const page = await this.browser.newPage();
      await page.goto(job.data.loginUrl);
      const emailInput = await page.$(job.data.usernameSelector);
      await emailInput?.type(job.data.username);
      const passwordInput = await page.$(job.data.passwordSelector);
      await passwordInput?.type(job.data.password);
      const submitButton = await page.$(job.data.submitSelector);
      await submitButton?.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      if (job.data.hasPin) {
        const pinInput = await page.$(job.data.pinSelector);
        pinInput?.type(job.data.pin);
      }
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      await page.close();
      await Promise.allSettled(
        Array.from({ length: job.data.count }, (_, k) =>
          this.lighthouseQueue.add(LighthouseJobNameEnum.MEASURE, {
            ...job.data,
            index: k,
            measureMongoId: createdMeasure.id,
          }),
        ),
      );
    } catch (error) {
      this.error(error);
    }
    this.log(`${this.consumerLogin.name} ${FunctionExecutionStateEnum.END}`);
  }
}

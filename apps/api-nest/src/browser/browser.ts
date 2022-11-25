import { InjectQueue, Process } from '@nestjs/bull';
import { Processor } from '@nestjs/bull';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job, Queue } from 'bull';
import { Model } from 'mongoose';
import puppeteer, { Browser as PuppeteerBrowser } from 'puppeteer';
import { PUPPETEER_PORT, WORKER_CONCURRENCY } from 'src/app.constant';
import { FunctionExecutionStateEnum, QueueNameEnum } from 'src/app.enum';
import { MeasureDto } from 'src/lighthouse/lighthouse.dto';
import { LighthouseJobNameEnum } from 'src/lighthouse/lighthouse.enum';
import { Measure, MeasureProgressEnum } from 'src/lighthouse/lighthouse.schema';
import { LoginDto } from './browser.dto';
import { BrowserJobName } from './browser.enum';

@Injectable()
@Processor(QueueNameEnum.BROWSER)
export class Browser extends ConsoleLogger {
  browser: PuppeteerBrowser;
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
  async consumerLogin(job: Job<LoginDto>) {
    this.log(`${this.consumerLogin.name} ${FunctionExecutionStateEnum.START}`);
    try {
      const measureDocument = await this.measureModel.findById(
        job.data.measureMongoId,
      );
      if (measureDocument) {
        measureDocument.set('progress', MeasureProgressEnum.IN_PROGRESS);
        await measureDocument.save();

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
          Array.from({ length: Number.parseInt(job.data.count, 10) }, (_, k) =>
            this.lighthouseQueue.add(LighthouseJobNameEnum.MEASURE, {
              ...job.data,
              index: k,
            }),
          ),
        );
      }
    } catch (error) {
      this.error(error);
    }
    this.log(`${this.consumerLogin.name} ${FunctionExecutionStateEnum.END}`);
  }
}

import { Process } from '@nestjs/bull';
import { Processor } from '@nestjs/bull';
import { ConsoleLogger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Model } from 'mongoose';
import camelCase from 'camelcase';
import { PUPPETEER_PORT } from 'src/app.constant';
import { FunctionExecutionStateEnum, QueueNameEnum } from 'src/app.enum';
import { Browser } from 'src/browser/browser';
import { MeasureDto } from './lighthouse.dto';
import { LighthouseJobNameEnum } from './lighthouse.enum';
import { Measure, Score, ScoreDocument } from './lighthouse.schema';

@Processor(QueueNameEnum.LIGHTHOUSE)
export class Lighthouse extends ConsoleLogger {
  private createdScores: ScoreDocument[] = [];
  constructor(
    @InjectModel(Measure.name) private measureModel: Model<Measure>,
    @InjectModel(Score.name) private scoreModel: Model<Score>,
    private readonly browserService: Browser,
  ) {
    super(Lighthouse.name);
  }
  async runLighthouse(job: Job<MeasureDto>) {
    try {
      const { default: lighthouse } = await import('lighthouse');
      // eslint-disable-next-line
      const desktopConfig = require('lighthouse/lighthouse-core/config/desktop-config.js');
      const { lhr } = await lighthouse(
        job.data.url,
        {
          port: PUPPETEER_PORT,
          output: ['json'],
        },
        desktopConfig,
      );
      const score = Object.fromEntries(
        Object.entries(lhr.categories).map(([key, value]) => [
          camelCase(key),
          value.score,
        ]),
      );
      this.log(job.id);
      this.log(score);
      const createdScore = new this.scoreModel({
        ...score,
        jobId: job.id,
      });
      this.createdScores.push(await createdScore.save());
    } catch (error) {
      this.error(error);
    }
  }
  @Process({
    name: LighthouseJobNameEnum.MEASURE,
  })
  async measure(job: Job<MeasureDto>) {
    this.log(`${this.measure.name} ${FunctionExecutionStateEnum.START}`);
    if (this.browserService.browser) {
      await this.runLighthouse(job);
    } else {
      await this.browserService.initBrowser();
      await this.runLighthouse(job);
    }
    if (job.data.index + 1 === job.data.count) {
      const createdMeasure = new this.measureModel({
        name: job.data.name,
        scores: this.createdScores,
      });
      this.log(await createdMeasure.save());
      await this.browserService.browser.close();
    }
    this.log(`${this.measure.name} ${FunctionExecutionStateEnum.END}`);
  }
}

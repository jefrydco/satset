import { Process } from '@nestjs/bull';
import { Processor } from '@nestjs/bull';
import { ConsoleLogger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { writeJson } from 'fs-extra';
import { Model } from 'mongoose';
import camelCase from 'camelcase';
import { PUPPETEER_PORT } from 'src/app.constant';
import { FunctionExecutionStateEnum, QueueNameEnum } from 'src/app.enum';
import { Browser } from 'src/browser/browser';
import { MeasureDto } from './lighthouse.dto';
import { LighthouseJobNameEnum } from './lighthouse.enum';
import {
  Measure,
  MeasureProgressEnum,
  Score,
  ScoreDocument,
} from './lighthouse.schema';

@Processor(QueueNameEnum.LIGHTHOUSE)
export class Lighthouse extends ConsoleLogger {
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
      await writeJson(
        `${job.data.name}-${job.data.index}-${job.data.measureMongoId}.json`,
        lhr,
        { spaces: 2 },
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
      return createdScore.save();
    } catch (error) {
      this.error(error);
    }
  }
  @Process({
    name: LighthouseJobNameEnum.MEASURE,
  })
  async consumerMeasure(job: Job<MeasureDto>) {
    this.log(
      `${this.consumerMeasure.name} ${FunctionExecutionStateEnum.START}`,
    );
    try {
      if (this.browserService.browser) {
        const measureDocument = await this.measureModel.findById(
          job.data.measureMongoId,
        );
        const score = await this.runLighthouse(job);
        measureDocument?.set('scores', [...measureDocument.scores, score]);
        await measureDocument?.save();
      } else {
        await this.browserService.initBrowser();
        const measureDocument = await this.measureModel.findById(
          job.data.measureMongoId,
        );
        const score = await this.runLighthouse(job);
        measureDocument?.set('scores', [...measureDocument.scores, score]);
        await measureDocument?.save();
      }
      if (job.data.index + 1 === job.data.count) {
        const measureDocument = await this.measureModel.findById(
          job.data.measureMongoId,
        );
        measureDocument?.set('progress', MeasureProgressEnum.COMPLETED);
        await measureDocument?.save();
        await this.browserService.browser.close();
      }
    } catch (error) {
      this.error(error);
    }
    this.log(`${this.consumerMeasure.name} ${FunctionExecutionStateEnum.END}`);
  }
}

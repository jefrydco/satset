import { Body, ConsoleLogger, Controller, Post, Version } from '@nestjs/common';
import { FlattenMaps, LeanDocument } from 'mongoose';
import { FunctionExecutionStateEnum } from 'src/app.enum';
import { Measure, Score } from 'src/lighthouse/lighthouse.schema';
import { RunRequestPayloadDto, RunStatusRequestPayloadDto } from './api.dto';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController extends ConsoleLogger {
  constructor(private readonly apiService: ApiService) {
    super(ApiController.name);
  }

  @Version('1')
  @Post('run')
  async run(@Body() runRequestPayloadDto: RunRequestPayloadDto) {
    this.log(`${this.run.name} ${FunctionExecutionStateEnum.START}`);
    const createdMeasure = await this.apiService.storeMeasure(
      runRequestPayloadDto,
    );
    if (createdMeasure) {
      await this.apiService.publishRun({
        ...runRequestPayloadDto,
        measureMongoId: createdMeasure.id,
      });
      return {
        run: true,
        measureMongoId: createdMeasure.id,
      };
    }
    this.log(`${this.run.name} ${FunctionExecutionStateEnum.END}`);
    return {
      run: false,
      measureMongoId: undefined,
    };
  }

  getCategories(
    measureDocument: FlattenMaps<LeanDocument<Measure>>,
    key: keyof Omit<Score, 'jobId'>,
  ) {
    return measureDocument?.scores.map((score) => score[key]);
  }

  @Version('1')
  @Post('run/status')
  async runStatus(
    @Body() runStatusRequestPayloadDto: RunStatusRequestPayloadDto,
  ) {
    const measureDocument = await this.apiService.getMeasure(
      runStatusRequestPayloadDto,
    );
    if (measureDocument) {
      return {
        exists: true,
        ...measureDocument,
        chart: {
          dataset: [
            ['Test', ...this.getCategories(measureDocument, 'scoreName')],
            [
              'Performance',
              ...this.getCategories(measureDocument, 'performance'),
            ],
            [
              'Accessibility',
              ...this.getCategories(measureDocument, 'accessibility'),
            ],
            [
              'Best Practice',
              ...this.getCategories(measureDocument, 'bestPractices'),
            ],
            ['SEO', ...this.getCategories(measureDocument, 'seo')],
            ['PWA', ...this.getCategories(measureDocument, 'pwa')],
          ],
        },
      };
    }
    return {
      exists: false,
    };
  }
}

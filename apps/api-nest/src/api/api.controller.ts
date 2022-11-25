import { Body, ConsoleLogger, Controller, Post } from '@nestjs/common';
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

  @Post('v1/run')
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

  @Post('v1/run/status')
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
          labels: Array.from(
            { length: measureDocument.scores.length },
            (_, k) => `Test ${k}`,
          ),
          datasets: [
            {
              label: 'Performance',
              data: this.getCategories(measureDocument, 'performance'),
              borderColor: 'rgb(229, 57, 53)',
              backgroundColor: 'rgba(229, 57, 53, 0.5)',
            },
            {
              label: 'Accessibility',
              data: this.getCategories(measureDocument, 'accessibility'),
              borderColor: 'rgb(145, 184, 89)',
              backgroundColor: 'rgba(145, 184, 89, 0.5)',
            },
            {
              label: 'Best Practice',
              data: this.getCategories(measureDocument, 'bestPractices'),
              borderColor: 'rgb(57, 173, 181)',
              backgroundColor: 'rgba(57, 173, 181, 0.5)',
            },
            {
              label: 'SEO',
              data: this.getCategories(measureDocument, 'seo'),
              borderColor: 'rgb(246, 164, 52)',
              backgroundColor: 'rgba(246, 164, 52, 0.5)',
            },
            {
              label: 'PWA',
              data: this.getCategories(measureDocument, 'pwa'),
              borderColor: 'rgb(124, 77, 255)',
              backgroundColor: 'rgba(124, 77, 255, 0.5)',
            },
          ],
        },
      };
    }
    return {
      exists: false,
    };
  }
}

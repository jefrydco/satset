import { Body, ConsoleLogger, Controller, Post } from '@nestjs/common';
import { FunctionExecutionStateEnum } from 'src/app.enum';
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

  @Post('v1/run/status')
  async runStatus(
    @Body() runStatusRequestPayloadDto: RunStatusRequestPayloadDto,
  ) {
    const measureDocument = await this.apiService.getMeasure(
      runStatusRequestPayloadDto,
    );
    return measureDocument;
  }
}

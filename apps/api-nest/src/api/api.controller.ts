import { Body, ConsoleLogger, Controller, Post } from '@nestjs/common';
import { FunctionExecutionStateEnum } from 'src/app.enum';
import { RunRequestPayloadDto } from './api.dto';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController extends ConsoleLogger {
  constructor(private readonly apiService: ApiService) {
    super(ApiController.name);
  }

  @Post('v1/run')
  async run(@Body() runRequestPayloadDto: RunRequestPayloadDto) {
    this.log(`${this.run.name} ${FunctionExecutionStateEnum.START}`);
    await this.apiService.publishRun(runRequestPayloadDto);
    this.log(`${this.run.name} ${FunctionExecutionStateEnum.END}`);
    return {
      run: true,
    };
  }

  @Post('v1/run/status')
  async status() {
    return {
      status: true,
    };
  }
}

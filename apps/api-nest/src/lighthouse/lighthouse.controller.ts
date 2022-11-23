import { Controller, Get } from '@nestjs/common';
import { LighthouseService } from './lighthouse.service';

@Controller('lighthouse')
export class LighthouseController {
  constructor(private readonly lighthouseService: LighthouseService) {}

  @Get()
  async get() {
    await this.lighthouseService.publish();
    return {
      ok: true,
    };
  }
}

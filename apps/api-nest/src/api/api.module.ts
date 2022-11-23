import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { Api } from './api';
import { QueueNameEnum } from 'src/app.enum';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueNameEnum.API,
    }),
    BullModule.registerQueue({
      name: QueueNameEnum.BROWSER,
    }),
    BullModule.registerQueue({
      name: QueueNameEnum.LIGHTHOUSE,
    }),
  ],
  controllers: [ApiController],
  providers: [ApiService, Api],
})
export class ApiModule {}

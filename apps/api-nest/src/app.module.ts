import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LighthouseModule } from './lighthouse/lighthouse.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: '0.0.0.0',
        port: 6379,
      },
    }),
    LighthouseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LighthouseModule } from './lighthouse/lighthouse.module';
import { BrowserModule } from './browser/browser.module';
import { RunModule } from './run/run.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: '0.0.0.0',
        port: 6379,
      },
    }),
    MongooseModule.forRoot('mongodb://admin:admin123@0.0.0.0:27017', {
      dbName: 'lighthouse',
    }),
    LighthouseModule,
    BrowserModule,
    RunModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

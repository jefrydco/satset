declare const module: any;

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import fastifyCsrf from '@fastify/csrf-protection';
import { HEADER_APP_VERSION_KEY } from '@satset/constant';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: HEADER_APP_VERSION_KEY,
  });
  app.setGlobalPrefix('api');
  await app.register(helmet);
  await app.register(fastifyCsrf);
  await app.listen(3001, '0.0.0.0');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

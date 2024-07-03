import { LogLevel, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const port = config.get<number>('PORT', 3000);
  const tcpPort = config.get<number>('TCP_PORT', 4000);

  const logLevel = config.get<string>('LOG_LEVEL', 'log');
  Logger.overrideLogger(getLogLevels(logLevel));

  app.use(new LoggerMiddleware().use);
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.TCP,
      options: {
        port: tcpPort
      }
    },
    { inheritAppConfig: true },);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.startAllMicroservices();
  await app.listen(port);
}

function getLogLevels(level: string): (LogLevel)[] {
  const levels = ['log', 'error', 'warn', 'debug', 'verbose'];
  const levelIndex = levels.indexOf(level);
  if (levelIndex === -1) {
    return ['log', 'error', 'warn'];
  }
  return levels.slice(0, levelIndex + 1) as (LogLevel)[];
}

bootstrap();

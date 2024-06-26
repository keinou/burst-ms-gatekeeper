import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const port = config.get<number>('PORT', 3000);
  const tcpPort = config.get<number>('TCP_PORT', 4000);

  const logger = new Logger('requests');
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const { method, url, ip } = req;
      const { statusCode } = res;
      const duration = Date.now() - start;

      if (statusCode >= 400 && statusCode < 500) {
        logger.warn(`[${method}] ${url} {${statusCode}} ${duration}ms [${ip}]`);
      } else if (statusCode >= 500) {
        logger.error(
          `[${method}] ${url} {${statusCode}} ${duration}ms [${ip}]`,
        );
      } else {
        logger.log(`[${method}] ${url} {${statusCode}} ${duration}ms [${ip}]`);
      }
    });
    next();
  });

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
bootstrap();

import { ReflectionService } from '@grpc/reflection';
import { LogLevel, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';

declare const module: any;

const protoPath = process.env.NODE_ENV === 'production'
  ? join(__dirname, './proto/auth.proto')
  : join(__dirname, '../src/proto/auth.proto');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const port = config.get<number>('PORT', 3000);
  const tcpPort = config.get<number>('TCP_PORT', 5000);

  const logLevel = config.get<string>('LOG_LEVEL', 'log');
  Logger.overrideLogger(getLogLevels(logLevel));

  app.use(new LoggerMiddleware().use);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: protoPath,
      url: process.env.AUTH_MICROSERVICE_URL || `localhost:${tcpPort}`,
      onLoadPackageDefinition: (pkg, server) => {
        new ReflectionService(pkg).addToServer(server);
      },
    },
  }, { inheritAppConfig: true }
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // OpenApi
  const configSwagger = new DocumentBuilder()
    .setTitle('Gatekeeper')
    .setDescription('The auth API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('docs', app, document);

  await app.startAllMicroservices();
  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
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

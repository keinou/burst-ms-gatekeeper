import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { Session } from './session/entity/session.entity';
import { SessionModule } from './session/session.module';
import { User } from './user/entity/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'admin'),
        password: configService.get<string>('DB_PASS', 'admin'),
        database: configService.get<string>('DB_DATABASE', 'burst_gatekeeper'),
        synchronize: true,
        entities: [User, Session]
      }),
      inject: [ConfigService]
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST', 'smtp.hostinger.com'),
          port: configService.get<number>('SMTP_PORT', 465),
          ignoreTLS: configService.get<boolean>('SMTP_IGNORE_SSL', false),
          secure: configService.get<boolean>('SMTP_SECURE', true),
          auth: {
            user: configService.get<string>('SMTP_USER', ''),
            pass: configService.get<string>('SMTP_PASS', ''),
          },
        },
        defaults: {
          from: '"Burst Gatekeeper" <>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    SessionModule,
    HealthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
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
        entities: [User]
      }),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot(),
    AuthModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

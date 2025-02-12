import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Session } from 'src/session/entity/session.entity';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Constants } from 'src/utils/constants';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Session]),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'AUTH_CLIENT',
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: 'auth',
              protoPath: Constants.protoPath,
              url: process.env.AUTH_MICROSERVICE_URL || `localhost:${configService.get<number>('TCP_PORT', 5000)}`,
            },
          }),
          inject: [ConfigService],
        }
      ]
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }

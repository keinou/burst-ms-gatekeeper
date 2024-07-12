import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/session/entity/session.entity';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

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
            transport: Transport.TCP,
            options: {
              host: 'localhost',
              port: configService.get<number>('TCP_PORT', 4000),
            }
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

import { Proto } from '@devburst-io/burst-lib-commons';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
import { OrganizationMember } from 'src/organization/entities/organization.member.entity';
import { OrganizationModule } from 'src/organization/organization.module';
import { OrganizationService } from 'src/organization/organization.service';
import { Session } from 'src/session/entity/session.entity';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Session, Organization, OrganizationMember]),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'AUTH_CLIENT',
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: ['auth', 'organization'],
              protoPath: Proto.configFilePath,
              url: process.env.AUTH_MICROSERVICE_URL || `localhost:${configService.get<number>('TCP_PORT', 5000)}`,
            },
          }),
          inject: [ConfigService],
        }
      ]
    }),
    OrganizationModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
    OrganizationService,
  ],
})
export class UserModule { }

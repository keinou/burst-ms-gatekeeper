import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { Session } from "src/session/entity/session.entity";
import { SessionModule } from "src/session/session.module";
import { SessionService } from "src/session/session.service";
import { JwtRefreshStrategy } from "src/strategies/jwt-refresh.strategy";
import { LocalStrategy } from "src/strategies/local.strategy";
import { User } from "src/user/entity/user.entity";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { AuthController } from "./auth.controller";
import { AuthGrpcController } from "./auth.grpc.controller";
import { AuthService } from "./auth.service";
import { Constants } from "src/utils/constants";

@Module({
  imports: [
    UserModule,
    ConfigModule,
    PassportModule,
    SessionModule,
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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'super-secret'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES', '2h')
        }
      }),
      inject: [ConfigService],
    })],
  controllers: [
    AuthController,
    AuthGrpcController
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtRefreshStrategy,
    UserService,
    SessionService
  ],
})
export class AuthModule { }
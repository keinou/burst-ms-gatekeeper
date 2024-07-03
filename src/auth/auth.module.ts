import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocalStrategy } from "src/strategies/local.strategy";
import { User } from "src/user/entity/user.entity";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    PassportModule,
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
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    UserService
  ],
})
export class AuthModule { }
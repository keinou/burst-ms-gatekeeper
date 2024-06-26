import { Inject, Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { compareSync } from 'bcrypt';
import { TimeoutError, catchError, firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService) { }

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user$ = await this.client.send({ role: 'user', cmd: 'get' }, { username })
        .pipe(
          timeout(5000),
          catchError(err => {
            if (err instanceof TimeoutError) {
              throw new RequestTimeoutException();
            }
            throw new err;
          }));
      const user = await firstValueFrom(user$);

      if (compareSync(password, user?.password)) {
        return user;
      }

      return null;
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }

  async login(user) {
    const payload = { user, sub: user.id };

    return {
      token: this.jwtService.sign(payload)
    };
  }

  async validateToken(token) {
    return await this.jwtService.verifyAsync(
      token,
      {
        secret: this.configService.get<string>('JWT_SECRET', 'super-secret'),
      }
    );
  }
}
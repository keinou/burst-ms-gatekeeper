import { Inject, Injectable, Logger, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { compareSync } from 'bcrypt';
import { toMs } from 'ms-typescript';
import { TimeoutError, catchError, firstValueFrom, timeout } from 'rxjs';
import { Session } from 'src/session/entity/session.entity';
import { SessionService } from 'src/session/session.service';
import { User } from 'src/user/entity/user.entity';
import { CryptoHelper } from 'src/utils/crypto.helper';

@Injectable()
export class AuthService {

  cryptoHelper: CryptoHelper

  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService
  ) {
    this.cryptoHelper = new CryptoHelper({ configService })
  }

  async validateUser(email: string, encryptedPassword: string): Promise<any> {
    try {
      const user$ = await this.client.send({ role: 'user', cmd: 'get' }, { email })
        .pipe(
          timeout(5000),
          catchError(err => {
            if (err instanceof TimeoutError) {
              throw new RequestTimeoutException();
            }
            throw err;
          }));
      const user = await firstValueFrom(user$);
      const password = this.cryptoHelper.decryptData(encryptedPassword);

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
    const data = { ...user, password: undefined };
    const { createHash } = await import('node:crypto');
    const hash = createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.create({
      user,
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      user: data,
      sessionId: session.id,
      hash,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      data,
    };
  }

  async validateToken(token) {
    const result = await this.jwtService.verifyAsync(
      token,
      {
        secret: this.configService.get<string>('JWT_SECRET', 'super-secret'),
      }
    )
    return result;
  }

  async refreshToken(sessionId: string, data) {
    const session = await this.sessionService.findById(sessionId);
    const { createHash } = await import('node:crypto');
    const hash = createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    if (!session)
      throw new UnauthorizedException();

    if (session.hash !== data.hash)
      throw new UnauthorizedException();

    const user$ = await this.client.send({ role: 'user', cmd: 'get' }, { email: data.email })
      .pipe(
        timeout(5000),
        catchError(err => {
          if (err instanceof TimeoutError) {
            throw new RequestTimeoutException();
          }
          throw err;
        }));
    const user = await firstValueFrom(user$);

    if (user.id !== session.user.id)
      throw new UnauthorizedException();

    await this.sessionService.update(session.id, { hash });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      sessionId: sessionId,
      hash: hash,
      user: user,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      data,
    };

  }

  private async getTokensData(data: {
    user: User;
    sessionId: Session['id'];
    hash: Session['hash'];
  }) {
    const tokenExpiresIn = this.configService.get<string>('JWT_EXPIRES', '2h');

    const tokenExpires = Date.now() + toMs(tokenExpiresIn);

    const token = await this.jwtService.signAsync(
      {
        user: data.user,
        sessionId: data.sessionId,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET', 'super-secret'),
        expiresIn: tokenExpiresIn,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sessionId: data.sessionId,
        email: data.user.email,
        hash: data.hash,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH', 'super-secret'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_REFRESH', '365d'),
      },
    );

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
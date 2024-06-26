import { CanActivate, ExecutionContext, Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req || !req.headers['authorization']) {
      return false;
    }

    try {
      const res$ = await this.client.send(
        { role: 'auth', cmd: 'check' },
        { jwt: req.headers['authorization'].split(' ')[1] }
      );

      const payload = await firstValueFrom(res$);
      const user = { ...payload.user, password: undefined };
      req['user'] = user;

      return true;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }
}
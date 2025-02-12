import { CanActivate, ExecutionContext, Inject, Logger, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable, firstValueFrom } from "rxjs";

interface AuthServiceGrpc {
    checkLoggedIn(data: { jwt: string }): Observable<{ isValid: boolean; sessionId: string; user: any }>;
}

export class AuthGuard implements CanActivate, OnModuleInit {
    private authService: AuthServiceGrpc;

    constructor(
        @Inject('AUTH_CLIENT')
        private readonly client: ClientGrpc
    ) { }

    onModuleInit() {
        this.authService = this.client.getService<AuthServiceGrpc>('AuthService');
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return false;
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload = await firstValueFrom(this.authService.checkLoggedIn({ jwt: token }));

            if (payload.isValid) {
                req['user'] = payload.user;
                req['sessionId'] = payload.sessionId;
                return true;
            }
            return false;
        } catch (error) {
            Logger.error(`AuthGuard error: ${error.message}`);
            return false;
        }
    }
}

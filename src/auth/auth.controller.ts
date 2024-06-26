import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @MessagePattern({ role: 'auth', cmd: 'check' })
  async loggedIn(data: any) {
    try {
      const res = await this.authService.validateToken(data.jwt);

      return res;
    } catch (error) {
      throw error;
    }
  }
}
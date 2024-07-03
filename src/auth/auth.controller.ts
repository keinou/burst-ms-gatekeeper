import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'Login successful', type: JwtResponseDto })
  @UseGuards(AuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Initiate password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.userService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid token or password' })
  @UseGuards(AuthGuard)
  async resetPassword(@Request() req, @Body() resetPasswordDto: LoginDto) {
    return this.userService.resetPassword(req.user.id, resetPasswordDto);
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
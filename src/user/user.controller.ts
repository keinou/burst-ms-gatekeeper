import { Controller, Get, ParseIntPipe, Query, Request, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @MessagePattern({ role: 'user', cmd: 'get' })
  getUser(data: any): Promise<Partial<User>> {
    return this.userService.findOne(data.username);
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('pageSize') pageSize = 10) {
    return this.userService.findAll(page, pageSize);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Request() req): Promise<User | string> {
    return req.user;
  }

}

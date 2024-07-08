import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entity/session.entity';
import { SessionService } from './session.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
  ],
  providers: [SessionService],
})
export class SessionModule { }

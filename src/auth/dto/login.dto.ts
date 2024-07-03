import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  email: string;

  @ApiProperty({ example: 'admin' })
  password: string;
}

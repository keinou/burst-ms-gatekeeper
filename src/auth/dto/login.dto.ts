import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  email: string;

  @ApiProperty({ example: 'OZmPxnh0HfjQPwT5Kc75lw....', description: 'Password sign with the public key' })
  password: string;
}

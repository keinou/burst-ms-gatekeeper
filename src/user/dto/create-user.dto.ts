import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Super User' })
  name: string;

  @ApiProperty({ example: 'super-user@gmail.com' })
  email: string;

  @ApiProperty({ example: 'admin', enum: Role, required: false, default: Role.Common })
  role: Role;

  @ApiProperty({ example: 'super-pass' })
  password: string;
}

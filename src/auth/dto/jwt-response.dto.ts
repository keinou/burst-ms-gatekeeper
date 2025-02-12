import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entity/user.entity';

export class JwtResponseDto {
  @ApiProperty({ example: 'your.jwt.token.here' })
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  tokenExpires: number;

  @ApiProperty()
  data: User;
}

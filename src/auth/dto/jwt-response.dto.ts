import { ApiProperty } from '@nestjs/swagger';

export class JwtResponseDto {
  @ApiProperty({ example: 'your.jwt.token.here' })
  token: string;
}

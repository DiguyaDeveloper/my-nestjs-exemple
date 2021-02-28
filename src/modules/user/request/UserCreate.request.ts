import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from 'src/shared/common/constants/role-type';
import { UserDto } from '../dto/User.dto';

export class UserCreateRequest {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  readonly role: RoleType;

  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly avatar: string;

  dtoClass = UserDto;
}

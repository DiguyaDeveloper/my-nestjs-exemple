import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AbstractEntity } from '../../../shared/common/entity/abstract.entity';
import { RoleType } from '../../../shared/common/constants/role-type';
import { UserDto } from '../dto/User.dto';
import { UserResponse } from '../responses/user.response';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  dtoClass = UserDto;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string, password: string): Promise<boolean> {
    return await bcrypt.compare(attempt, password);
  }

  toResponseObject(showToken: boolean = true): UserResponse {
    const { id, firstName, lastName, email } = this;
    const responseObject: UserResponse = {
      id,
      firstName,
      lastName,
      email,
    };

    return responseObject;
  }
}

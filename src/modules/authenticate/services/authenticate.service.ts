import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { IJwtPayload } from './../interfaces/jwt-payload';
import { UserEntity } from 'src/modules/user/models/User.entity';
import { UserResponse } from 'src/modules/user/responses/user.response';
import { IRegistrationStatus } from './../interfaces/registration-status';
import { UserCreateRequest } from 'src/modules/user/request/UserCreate.request';

@Injectable()
export class AuthenticateService {
  constructor(private readonly usersService: UserService) {}

  private readonly logger = new Logger(AuthenticateService.name);

  async register(user: UserCreateRequest) {
    let status: IRegistrationStatus = {
      success: true,
      message: 'user register',
    };
    try {
      await this.usersService.register(user);
    } catch (err) {
      //debug(err);
      status = { success: false, message: err };
    }
    return status;
  }
  createToken(user: UserEntity) {
    //debug('get the expiration');
    const expiresIn = 3600;
    //debug('sign the token');
    //debug(user);

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
      },
      'Codebrains',
      { expiresIn },
    );
    //debug('return the token');
    //debug(accessToken);
    return {
      expiresIn,
      accessToken,
      user: {
        name: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
    };
  }

  async validateUserToken(payload: IJwtPayload): Promise<UserEntity> {
    return await this.usersService.findById(payload.id);
  }
  async validateUser(email: string, password: string): Promise<UserResponse> {
    const user = await this.usersService.findByEmail(email);
    if (user && await user.comparePassword(password, user.password)) {
      this.logger.log('password check success');
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}

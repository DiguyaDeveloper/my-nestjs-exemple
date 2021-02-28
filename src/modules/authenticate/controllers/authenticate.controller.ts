import {
  Controller,
  UseGuards,
  HttpStatus,
  Response,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthenticateService } from './../services/authenticate.service';
import { UserService } from './../../user/services/user.service';
import { UserCreateRequest } from './../../user/request/UserCreate.request';
import { LoginUserDto } from './../dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import errors from 'src/modules/user/constants/errors';

@ApiTags('auth')
@Controller('authenticate')
export class AuthenticateController {
  constructor(
    private readonly authService: AuthenticateService,
    private readonly usersService: UserService,
  ) {}

  @Post('register')
  public async register(
    @Response() res,
    @Body() createUserDto: UserCreateRequest,
  ) {
    const result = await this.authService.register(createUserDto);
    if (!result.success) {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
    return res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public async login(@Response() res, @Body() login: LoginUserDto) {
    const user = await this.usersService.findByEmail(login.email);
    if (!user) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'User Not Found',
      });
    } else {
      const userReturn = await this.authService.validateUser(user.email, login.password);
      if (!userReturn) { 
        throw new UnauthorizedException(errors.USER_INVALID_PASSWORD)
      }
      const token = this.authService.createToken(user);
      return res.status(HttpStatus.OK).json(token);
    }
  }
}

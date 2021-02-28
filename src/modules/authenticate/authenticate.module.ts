import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateService } from './services/authenticate.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'Codebrains',
      signOptions: { expiresIn: 3600 },
    }),
  ],
  controllers: [AuthenticateController],
  providers: [AuthenticateService, LocalStrategy, JwtStrategy],
  exports: [AuthenticateService, LocalStrategy, JwtStrategy],
})
export class AuthenticateModule {}

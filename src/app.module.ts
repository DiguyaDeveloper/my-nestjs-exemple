import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticateModule } from './modules/authenticate/authenticate.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(), AuthenticateModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import systemConfig from '@core/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: systemConfig.jwt.secret,
      signOptions: { expiresIn: systemConfig.jwt.expiresIn },
    }),
  ],
  providers: [TokenService, AuthService],

  exports: [TokenService, AuthService],
})
export class AuthModule {
  static http(): DynamicModule {
    return {
      module: AuthModule,
      controllers: [AuthController],
    };
  }
}

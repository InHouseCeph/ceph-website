import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export type TokenInfo = {
  iat: number;
  exp: number;
  sub: string;
};

@Injectable()
export class TokenService {
  constructor(private readonly jwtSrv: JwtService) {}

  sign(subject: string, payload?: string | any, options?: JwtSignOptions) {
    return this.jwtSrv.sign(payload ?? {}, { ...options, subject });
  }

  verify(token: string) {
    return this.jwtSrv.verify<TokenInfo>(token);
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { roles as defaultRoles } from '@core/auth/roles';
import { Role } from '@models/dtos';
import { User } from '@models/user.model';

import { LoginRequestDto, LoginResponseDto } from './auth.dto';
import { TokenService } from './token.service';

export interface AuthInfo {
  user?: User;
  iat?: string;
  exp?: string;
  sub?: string;
  roles: string[];
}

@Injectable()
export class AuthService {
  private validRoles: Role[];

  constructor(private readonly tokenSrv: TokenService) {
    this.validRoles = [...defaultRoles];
  }

  public allRoles() {
    return this.validRoles;
  }

  public async login(params: LoginRequestDto): Promise<LoginResponseDto> {
    const { username, password } = params;

    // validate
    if (username !== password) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    const token = this.tokenSrv.sign(username.toLowerCase());
    return { token };
  }
}

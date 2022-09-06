import { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '@models/user.model';
import { TokenInfo, TokenService } from '@modules/auth/token.service';
import { LoggerService } from '@modules/logger';

import { ROLES_KEY } from './auth.decorator';
import { hasRole } from './utils';
import { UserRole } from '.';

export type IAuthInfo = TokenInfo & {
  user?: User;
  roles?: string[];
};

export type AuthRequest = Request & {
  authInfo?: IAuthInfo;
};

@Injectable()
export class RestGuard implements CanActivate {
  constructor(
    private readonly logger: LoggerService,
    private readonly reflector: Reflector,
    private readonly tokenSrv: TokenService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authInfo = await this.getAuthInfoFromRequest(request);

    const allowedRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!allowedRoles || allowedRoles.includes(UserRole.EVERYONE)) {
      return true;
    }

    if (!authInfo)
      throw new UnauthorizedException('Please login to perform the action!', 'Unauthorized');

    return hasRole(authInfo.roles, allowedRoles);
  }

  private async getAuthInfoFromRequest(request: AuthRequest) {
    if (request.authInfo) {
      return request.authInfo;
    }

    let { authorization: token } = request.headers;
    if (!token) return null;

    // token may in form of "Bearer <token>"
    token = token.trim().split(' ').pop();

    let decoded: IAuthInfo = null;
    try {
      decoded = this.tokenSrv.verify(token);
    } catch (e) {
      this.logger.error('Invalid or expired token');
      return decoded;
    }

    decoded.user = { username: decoded.sub };
    decoded.roles = [UserRole.EVERYONE, UserRole.AUTHENTICATED];

    request.authInfo = decoded;

    return decoded;
  }
}

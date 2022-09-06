import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthInfo, UserRole } from '@core/auth';
import { Authorized } from '@core/auth/auth.decorator';
import { IAuthInfo, RestGuard } from '@core/auth/rest.guard';
import { Role } from '@models/dtos';
import { User } from '@models/user.model';

import { LoginRequestDto, LoginResponseDto } from './auth.dto';
import { AuthService } from './auth.service';

@UseGuards(RestGuard)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(protected readonly authSrv: AuthService) {}

  @ApiOkResponse({ type: LoginResponseDto })
  @Post('/login')
  async login(@Body() data: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authSrv.login(data);
  }

  @Post('/logout')
  logout() {
    return 'Ok';
  }

  @Authorized(UserRole.AUTHENTICATED)
  @ApiBearerAuth()
  @ApiOkResponse({ type: User })
  @Get('/me')
  async me(@AuthInfo() authInfo: IAuthInfo) {
    return authInfo.user;
  }

  @Authorized(UserRole.AUTHENTICATED)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Role, isArray: true })
  @Get('/roles')
  allRoles() {
    return this.authSrv.allRoles();
  }
}

import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

import { HealthCheckResult, HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @HealthCheck()
  @ApiOkResponse({ type: HealthCheckResult, description: 'The Health Check is successful' })
  @Get()
  live() {
    return this.service.liveness();
  }

  @ApiOkResponse({ type: Boolean, description: 'The app is ready to service' })
  @Get('/ready')
  ready() {
    return this.service.readiness();
  }
}

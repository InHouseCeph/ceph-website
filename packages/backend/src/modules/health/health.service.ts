import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { LoggerService } from '@modules/logger';

export class HealthCheckResult {
  @ApiProperty()
  uptime: number;
}

@Injectable()
export class HealthService implements OnApplicationBootstrap {
  constructor(private readonly logger: LoggerService) {}

  private startUpTime: Date;

  private ready = false;

  private notReadyReason = 'Not started';

  async onApplicationBootstrap() {
    this.startUpTime = new Date();
    this.notReadyReason = 'Checking';
    this.scheduleReadinessCheck();
  }

  liveness(): HealthCheckResult {
    const uptime = Math.ceil((Date.now() - this.startUpTime.valueOf()) / 1000);

    return { uptime };
  }

  readiness() {
    return { ready: this.ready, reason: this.ready ? undefined : this.notReadyReason };
  }

  private async scheduleReadinessCheck() {
    if (this.ready) return;

    return this.checkReadiness().then(
      () => {
        this.ready = true;
      },
      err => {
        this.notReadyReason = err?.message ?? 'Unknown';
        this.logger.error(err, 'Readiness check failed');
        setTimeout(() => this.scheduleReadinessCheck(), 10 * 1000);
      },
    );
  }

  private async checkReadiness() {
    // check the readiness of the app, eg:
    // able to read all parameters
    // able to read from dynamodb
    // able to connect to redis
    // ...

    this.logger.log('Ready check OK');
  }
}

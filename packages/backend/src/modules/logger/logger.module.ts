import { WinstonModule } from 'nest-winston';
import { Global, Module } from '@nestjs/common';

import { loggerOptions } from '@core/config/winston';

import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [WinstonModule.forRoot(loggerOptions)],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}

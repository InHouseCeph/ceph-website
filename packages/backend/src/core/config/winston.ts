import winston from 'winston';

import systemConfig from '.';

const { format } = winston;
const { combine, timestamp, colorize, printf } = format;

export const consoleLogFormat = combine(
  winston.format(info => {
    info.level = info.level.toUpperCase();
    return info;
  })(),
  timestamp(),
  colorize({
    all: !systemConfig.isProduction,
    colors: {
      info: 'green',
      debug: 'magenta',
      error: 'red',
      http: 'cyan',
    },
  }),
  printf(info => `${info.timestamp} [${info.level}] ${info.message}`),
);

export const loggerOptions: winston.LoggerOptions = {
  level: systemConfig.isDebugging || !systemConfig.isProduction ? 'debug' : 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(consoleLogFormat),
    }),
  ],
};

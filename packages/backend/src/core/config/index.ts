import '@env';

import { Injectable } from '@nestjs/common';

export enum SystemConfigKeys {
  JWT_SECRET = 'JWT_SECRET',
  JWT_EXPIRES = 'JWT_EXPIRES',
  MONGO_URL = 'MONGO_URL',
}

type JwtConfiguration = {
  secret: string;
  expiresIn: number;
};

type MongoDbConfiguration = {
  url: string;
};

@Injectable()
export class SystemConfigProvider {
  public get isDebugging() {
    return !!this.get('DEBUG');
  }

  public get isProduction() {
    return this.get('NODE_ENV', 'development') === 'production';
  }

  public get isTest() {
    return this.get('NODE_ENV', 'development') === 'test';
  }

  public get enableSwagger() {
    return !this.isTest && (!this.isProduction || this.isDebugging);
  }

  public get port(): number {
    return parseInt(this.get('PORT', '3001'), 10);
  }

  public get jwt(): JwtConfiguration {
    const secret = this.get(SystemConfigKeys.JWT_SECRET);
    const expires = this.get(SystemConfigKeys.JWT_EXPIRES, '86400');

    return { secret, expiresIn: parseInt(expires, 10) };
  }

  public get mongo(): MongoDbConfiguration {
    const url = this.get(SystemConfigKeys.MONGO_URL);

    return {
      url,
    };
  }

  public get(key: string, defaultValue?: string) {
    return process.env[key] || defaultValue;
  }
}

const systemConfig = new SystemConfigProvider();

export default systemConfig;

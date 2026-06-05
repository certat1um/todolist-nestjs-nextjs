import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { ConfigType, configSchema } from './config.schema';
dotenv.config();

@Injectable()
export class ConfigService {
  private readonly config: ConfigType;

  constructor() {
    const parsed = configSchema.safeParse(process.env);
    if (!parsed.success) {
      console.error(
        'Config Error. Invalid environment variable:',
        parsed.error?.issues?.[0]?.path?.[0],
      );
      process.exit(1);
    }
    this.config = parsed.data;
  }

  get<T extends keyof ConfigType>(key: T): ConfigType[T] {
    return this.config[key];
  }
}

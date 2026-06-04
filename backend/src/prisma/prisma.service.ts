import { Injectable } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL ?? 'file:./dev.db',
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}

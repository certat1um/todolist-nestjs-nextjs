import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CleanupService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCleanup() {
    const threshold = new Date(Date.now() - 10 * 1000);

    await this.prisma.todo.deleteMany({
      where: {
        deleted_at: {
          not: null,
          lte: threshold,
        },
      },
    });
  }
}

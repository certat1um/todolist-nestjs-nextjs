import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/libs/prisma/prisma.service';

@Injectable()
export class TodoCron {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupCompletedTodos() {
    const threshold = new Date(Date.now() - 10 * 1000);

    await this.prisma.todo.deleteMany({
      where: {
        OR: [
          { completed_at: { lte: threshold } },
          { deleted_at: { lte: threshold } },
        ],
      },
    });
  }
}

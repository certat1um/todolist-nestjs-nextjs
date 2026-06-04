import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  public async getAll() {
    return this.prisma.category.findMany({
      orderBy: { type: 'asc' },
    });
  }
}

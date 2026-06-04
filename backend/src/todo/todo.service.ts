import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  GetTodosQueryDto,
  CreateTodoDto,
  UpdateTodoDto,
} from './todo.schema.js';
import { PrismaService } from '../prisma/prisma.service';
import { MAX_TASKS_PER_CATEGORY } from '../libs/globals';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  public async getAll(query: GetTodosQueryDto) {
    return this.prisma.todo.findMany({
      where: {
        is_done: false,
        deleted_at: null,
        ...(query.category_id ? { category: { id: query.category_id } } : {}),
      },
      include: {
        category: true,
      },
      orderBy: { created_at: 'asc' },
    });
  }

  public async create(data: CreateTodoDto) {
    // Verify category
    const category = await this.prisma.category.findUnique({
      where: { id: data.category_id },
    });

    if (!category) {
      throw new NotFoundException(`Category not found.`);
    }

    // Verify max count
    const activeCount = await this.prisma.todo.count({
      where: {
        category_id: data.category_id,
        deleted_at: null,
      },
    });

    if (activeCount >= MAX_TASKS_PER_CATEGORY) {
      throw new BadRequestException(
        `Category "${category.type}" already has ${MAX_TASKS_PER_CATEGORY} tasks.`,
      );
    }

    // Create todo
    return this.prisma.todo.create({
      data: {
        title: data.title,
        category_id: data.category_id,
      },
      include: { category: true },
    });
  }

  public async updateById(id: string, data: UpdateTodoDto) {
    let deleted_at: string | null = null;

    if (data.mark_as_deleted) {
      deleted_at = new Date().toISOString();
    }

    return this.prisma.todo.update({
      where: { id },
      data: { is_done: data.is_done, deleted_at },
    });
  }

  public async deleteById(id: string) {
    return this.prisma.todo.delete({
      where: { id },
    });
  }
}

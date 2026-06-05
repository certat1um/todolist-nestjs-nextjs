import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import {
  GetTodosQuery,
  CreateTodoBody,
  BatchUpdateTodosBody,
  DeleteTodoParams,
  BatchDeleteTodosQuery,
  UpdateTodoParams,
  UpdateTodoBody,
} from './schemas/todo.schema';
import { MAX_TASKS_PER_CATEGORY } from 'src/common/types/constants';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  public async getAll(query: GetTodosQuery) {
    const { category_id } = query;

    // check
    if (category_id) {
      await this.prisma.category.findUniqueOrThrow({
        where: { id: category_id },
      });
    }

    return this.prisma.todo.findMany({
      where: {
        is_done: false,
        completed_at: null,
        deleted_at: null,
        ...(category_id ? { category_id } : {}),
      },
      include: {
        category: true,
      },
      orderBy: { created_at: 'asc' },
    });
  }

  public async create(body: CreateTodoBody) {
    const { title, category_id } = body;

    // Verify category
    const category = await this.prisma.category.findUnique({
      where: { id: category_id },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    // Verify max count
    const activeCount = await this.prisma.todo.count({
      where: {
        category_id,
        is_done: false,
        completed_at: null,
      },
    });

    if (activeCount >= MAX_TASKS_PER_CATEGORY) {
      throw new BadRequestException(
        `Category already has ${MAX_TASKS_PER_CATEGORY} tasks.`,
      );
    }

    // Create todo
    return this.prisma.todo.create({
      data: {
        title,
        category_id,
      },
      include: { category: true },
    });
  }

  public async updateById(params: UpdateTodoParams, body: UpdateTodoBody) {
    const { id } = params;
    const { is_done, mark_as_deleted } = body;

    return this.prisma.todo.update({
      where: { id },
      data: {
        is_done,
        ...(is_done
          ? { completed_at: new Date().toISOString() }
          : { completed_at: null }),
        ...(mark_as_deleted
          ? { deleted_at: new Date().toISOString() }
          : { deleted_at: null }),
      },
    });
  }

  public async batchUpdate(body: BatchUpdateTodosBody) {
    const { ids, data } = body;
    const { is_done, mark_as_deleted } = data;

    return this.prisma.todo.updateMany({
      where: { id: { in: ids } },
      data: {
        is_done,
        ...(is_done ? { completed_at: new Date().toISOString() } : null),
        ...(mark_as_deleted ? { deleted_at: new Date().toISOString() } : null),
      },
    });
  }

  public async deleteById(params: DeleteTodoParams) {
    const { id } = params;

    return this.prisma.todo.delete({
      where: { id },
    });
  }

  public async batchDelete(body: BatchDeleteTodosQuery) {
    const { ids } = body;

    return this.prisma.todo.deleteMany({
      where: { id: { in: ids } },
    });
  }
}

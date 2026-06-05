import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from '../todo.service';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MAX_TASKS_PER_CATEGORY } from 'src/common/types/constants';

const mockPrismaService = {
  category: {
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
  },
  todo: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
  },
};

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- getAll ---
  describe('getAll', () => {
    it('should return all active todos without filter', async () => {
      mockPrismaService.todo.findMany.mockResolvedValue([]);
      const result = await service.getAll({});
      expect(result).toEqual([]);
      expect(mockPrismaService.todo.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ is_done: false }),
        }),
      );
    });

    it('should validate category_id if provided', async () => {
      mockPrismaService.category.findUniqueOrThrow.mockResolvedValue({
        id: 'cat1',
      });
      mockPrismaService.todo.findMany.mockResolvedValue([]);

      await service.getAll({ category_id: 'cat1' });

      expect(mockPrismaService.category.findUniqueOrThrow).toHaveBeenCalledWith(
        {
          where: { id: 'cat1' },
        },
      );
    });
  });

  // --- create ---
  describe('create', () => {
    const body = { title: 'Test Todo', category_id: 'cat1' };

    it('should throw NotFoundException if category not found', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);
      await expect(service.create(body)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if category is at max capacity', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue({ id: 'cat1' });
      mockPrismaService.todo.count.mockResolvedValue(MAX_TASKS_PER_CATEGORY);
      await expect(service.create(body)).rejects.toThrow(BadRequestException);
    });

    it('should create a todo successfully', async () => {
      const mockTodo = { id: '1', ...body, category: {} };
      mockPrismaService.category.findUnique.mockResolvedValue({ id: 'cat1' });
      mockPrismaService.todo.count.mockResolvedValue(0);
      mockPrismaService.todo.create.mockResolvedValue(mockTodo);

      const result = await service.create(body);
      expect(result).toEqual(mockTodo);
    });
  });

  // --- updateById ---
  describe('updateById', () => {
    it('should set completed_at when marking done', async () => {
      mockPrismaService.todo.update.mockResolvedValue({
        id: '1',
        is_done: true,
      });
      await service.updateById({ id: '1' }, { is_done: true });

      expect(mockPrismaService.todo.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ completed_at: expect.any(String) }),
        }),
      );
    });

    it('should clear completed_at when marking not done', async () => {
      mockPrismaService.todo.update.mockResolvedValue({
        id: '1',
        is_done: false,
      });
      await service.updateById({ id: '1' }, { is_done: false });

      expect(mockPrismaService.todo.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ completed_at: null }),
        }),
      );
    });
  });

  // --- deleteById ---
  describe('deleteById', () => {
    it('should delete a todo by id', async () => {
      mockPrismaService.todo.delete.mockResolvedValue({ id: '1' });
      await service.deleteById({ id: '1' });
      expect(mockPrismaService.todo.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  // --- batchDelete ---
  describe('batchDelete', () => {
    it('should delete multiple todos', async () => {
      mockPrismaService.todo.deleteMany.mockResolvedValue({ count: 2 });
      await service.batchDelete({ ids: ['1', '2'] });
      expect(mockPrismaService.todo.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: ['1', '2'] } },
      });
    });
  });
});

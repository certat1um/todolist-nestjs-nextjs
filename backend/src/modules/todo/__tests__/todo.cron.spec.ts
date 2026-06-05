import { Test, TestingModule } from '@nestjs/testing';
import { TodoCron } from '../todo.cron';
import { PrismaService } from 'src/libs/prisma/prisma.service';

const mockPrismaService = {
  todo: {
    deleteMany: jest.fn(),
  },
};

describe('TodoCron', () => {
  let cron: TodoCron;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoCron,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    cron = module.get<TodoCron>(TodoCron);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(cron).toBeDefined();
  });

  describe('cleanupCompletedTodos', () => {
    it('should delete todos past the 10-second threshold', async () => {
      mockPrismaService.todo.deleteMany.mockResolvedValue({ count: 3 });

      await cron.cleanupCompletedTodos();

      expect(mockPrismaService.todo.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { completed_at: { lte: expect.any(Date) } },
              { deleted_at: { lte: expect.any(Date) } },
            ],
          },
        }),
      );
    });
  });
});

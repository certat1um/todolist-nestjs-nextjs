import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from '../todo.controller';
import { TodoService } from '../todo.service';

const mockTodoService = {
  getAll: jest.fn(),
  create: jest.fn(),
  updateById: jest.fn(),
  batchUpdate: jest.fn(),
  deleteById: jest.fn(),
  batchDelete: jest.fn(),
};

describe('TodoController', () => {
  let controller: TodoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{ provide: TodoService, useValue: mockTodoService }],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should delegate to todoService.getAll', async () => {
    mockTodoService.getAll.mockResolvedValue([]);
    const result = await controller.findAll({});
    expect(result).toEqual([]);
    expect(mockTodoService.getAll).toHaveBeenCalledWith({});
  });

  it('create should delegate to todoService.create', async () => {
    const body = { title: 'Test', category_id: 'cat1' };
    mockTodoService.create.mockResolvedValue({ id: '1', ...body });
    const result = await controller.create(body);
    expect(mockTodoService.create).toHaveBeenCalledWith(body);
    expect(result).toMatchObject(body);
  });

  it('deleteById should delegate to todoService.deleteById', async () => {
    mockTodoService.deleteById.mockResolvedValue({ id: '1' });
    await controller.deleteById({ id: '1' });
    expect(mockTodoService.deleteById).toHaveBeenCalledWith({ id: '1' });
  });
});

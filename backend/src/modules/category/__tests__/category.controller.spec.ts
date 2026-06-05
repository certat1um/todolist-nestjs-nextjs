import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';

const mockCategoryService = {
  getAll: jest.fn(),
};

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [{ provide: CategoryService, useValue: mockCategoryService }],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call categoryService.getAll and return result', async () => {
      const mockData = [{ id: '1', type: 'A' }];
      mockCategoryService.getAll.mockResolvedValue(mockData);

      const result = await controller.findAll();
      expect(result).toEqual(mockData);
      expect(mockCategoryService.getAll).toHaveBeenCalled();
    });
  });
});

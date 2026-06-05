import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { PrismaService } from 'src/libs/prisma/prisma.service';

const mockPrismaService = {
  category: {
    findMany: jest.fn(),
  },
};

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return categories ordered by type', async () => {
      const mockCategories = [
        { id: '1', type: 'A' },
        { id: '2', type: 'B' },
      ];
      mockPrismaService.category.findMany.mockResolvedValue(mockCategories);

      const result = await service.getAll();

      expect(result).toEqual(mockCategories);
      expect(mockPrismaService.category.findMany).toHaveBeenCalledWith({
        orderBy: { type: 'asc' },
      });
    });
  });
});

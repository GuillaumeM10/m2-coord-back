import { Test, TestingModule } from '@nestjs/testing';
import { FigureController } from './figures.controller';
import { FigureService } from './figures.services';
import { CreateFigureDto } from './dto/figures.dto';

describe('FigureController', () => {
  let controller: FigureController;

  const mockFigureService = {
    findAll: jest.fn(),
    getQuestions: jest.fn(),
    findByCode: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FigureController],
      providers: [
        {
          provide: FigureService,
          useValue: mockFigureService,
        },
      ],
    }).compile();

    controller = module.get<FigureController>(FigureController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should call figureService.findAll and return result', async () => {
      const result = [{ id: '1', name: 'Napoleon' }];
      mockFigureService.findAll.mockResolvedValue(result);

      const response = await controller.findAll();

      expect(mockFigureService.findAll).toHaveBeenCalled();
      expect(response).toEqual(result);
    });
  });

  describe('getQuestions', () => {
    it('should call figureService.getQuestions and return result', async () => {
      const result = [
        {
          id: '123',
          image: 'some-image',
          choices: ['A', 'B', 'C', 'D'],
        },
      ];

      mockFigureService.getQuestions.mockResolvedValue(result);

      const response = await controller.getQuestions();

      expect(mockFigureService.getQuestions).toHaveBeenCalled();
      expect(response).toEqual(result);
    });
  });

  describe('findByCode', () => {
    it('should call figureService.findByCode with parameters and return result', async () => {
      const question = 'Who is this?';
      const answer = 'Napoleon';
      const result = { question, answer };

      mockFigureService.findByCode.mockResolvedValue(result);

      const response = await controller.findByCode(question, answer);

      expect(mockFigureService.findByCode).toHaveBeenCalledWith(
        question,
        answer,
      );
      expect(response).toEqual(result);
    });
  });

  describe('create', () => {
    it('should call figureService.create and return created figure', async () => {
      const dto: CreateFigureDto = {
        name: 'Napoleon',
        image: 'url-to-image',
        type: 'figure',
      };

      const created = { ...dto, _id: '123' };

      mockFigureService.create.mockResolvedValue(created);

      const response = await controller.create(dto);

      expect(mockFigureService.create).toHaveBeenCalledWith(dto);
      expect(response).toEqual(created);
    });
  });
});

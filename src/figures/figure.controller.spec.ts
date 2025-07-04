import { Test, TestingModule } from '@nestjs/testing';
import { FigureController } from './figure.controller';
import { FigureService } from './figure.service';
import { CreateFigureDto } from './dto/create-figure.dto';

describe('FigureController', () => {
  let controller: FigureController;

  const mockService = {
    findAll: jest.fn(),
    getQuestions: jest.fn(),
    findByCode: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FigureController],
      providers: [{ provide: FigureService, useValue: mockService }],
    }).compile();

    controller = module.get<FigureController>(FigureController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all figures', async () => {
    const expected = [
      { name: 'Napoleon Bonaparte' },
      { name: 'Winston Churchill' },
    ];
    mockService.findAll.mockResolvedValue(expected);

    const result = await controller.findAll();
    expect(result).toEqual(expected);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should return questions', async () => {
    const expected = [
      {
        id: '1',
        image: 'napoleon.jpg',
        choices: [
          'Napoleon Bonaparte',
          'Julius Caesar',
          'Alexander the Great',
          'Charlemagne',
        ],
      },
    ];
    mockService.getQuestions.mockResolvedValue(expected);

    const result = await controller.getQuestions();
    expect(result).toEqual(expected);
    expect(mockService.getQuestions).toHaveBeenCalled();
  });

  it('should return a figure by code', async () => {
    const expected = { name: 'Napoleon Bonaparte', code: 'NB' };
    mockService.findByCode.mockResolvedValue(expected);

    const result = await controller.findByCode('NB');
    expect(result).toEqual(expected);
    expect(mockService.findByCode).toHaveBeenCalledWith('NB');
  });

  it('should create a figure', async () => {
    const dto: CreateFigureDto = {
      name: 'Napoleon Bonaparte',
      code: 'NB',
      image: 'https://images.com/napoleon.jpg',
      question: 'Who was the French Emperor?',
      answer: 'Napoleon Bonaparte',
    };
    const expected = { ...dto, _id: 'abc123' };
    mockService.create.mockResolvedValue(expected);

    const result = await controller.create(dto);
    expect(result).toEqual(expected);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });
});

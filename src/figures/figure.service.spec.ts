import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { QuizzDataFigures } from './schemas/quizzdata.schema';
import { FigureService } from './figures.services';
import { CreateFigureDto } from './dto/figures.dto';

describe('FigureService', () => {
  let service: FigureService;

  const mockSave = jest.fn();
  const mockConstructor = jest.fn(() => ({ save: mockSave }));
  const mockModel = {
    aggregate: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FigureService,
        {
          provide: getModelToken(QuizzDataFigures.name),
          useValue: Object.assign(mockConstructor, mockModel),
        },
      ],
    }).compile();

    service = module.get<FigureService>(FigureService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new figure', async () => {
    const dto: CreateFigureDto = {
      name: 'Napoleon Bonaparte',
      image: 'napoleon.jpg',
    };

    mockSave.mockResolvedValue({ ...dto, _id: 'abc123', type: 'figure' });

    const result = await service.create(dto);

    expect(mockConstructor).toHaveBeenCalledWith({ ...dto, type: 'figure' });
    expect(mockSave).toHaveBeenCalled();
    expect(result).toMatchObject({
      name: 'Napoleon Bonaparte',
      type: 'figure',
    });
  });

  it('should return all figures', async () => {
    const mockFigures = [
      { name: 'Napoleon Bonaparte' },
      { name: 'Winston Churchill' },
    ];
    mockModel.find.mockReturnValueOnce({
      exec: () => Promise.resolve(mockFigures),
    });

    const result = await service.findAll();
    expect(result).toEqual(mockFigures);
    expect(mockModel.find).toHaveBeenCalledWith({ type: 'figure' });
  });

  it('should return random figures', async () => {
    const sample = [
      { name: 'Napoleon Bonaparte' },
      { name: 'Winston Churchill' },
    ];
    mockModel.aggregate.mockResolvedValue(sample);

    const result = await service.getRandomFigures(2);
    expect(result).toEqual(sample);
    expect(mockModel.aggregate).toHaveBeenCalledWith([
      { $match: { type: 'figure' } },
      { $sample: { size: 2 } },
    ]);
  });

  it('should generate 20 questions with 4 shuffled choices', async () => {
    const allFigures = Array.from({ length: 50 }, (_, i) => ({
      name: `Figure${i}`,
      image: `figure${i}.jpg`,
      _id: `id${i}`,
    }));

    const correctFigures = allFigures.slice(0, 20);

    mockModel.aggregate.mockResolvedValue(correctFigures);
    mockModel.find.mockReturnValue({
      exec: () => Promise.resolve(allFigures),
    });

    const questions = await service.getQuestions();

    expect(questions).toHaveLength(20);
    for (const q of questions) {
      expect(typeof q.id).toBe('string');
      expect(typeof q.image).toBe('string');
      expect(Array.isArray(q.choices)).toBe(true);
      expect(q.choices).toHaveLength(4);
      expect(new Set(q.choices).size).toBe(4); // Pas de doublons
    }
  });

  it('should return a figure by code', async () => {
    const mockResult = { name: 'Napoleon Bonaparte', code: 'NB' };
    mockModel.findOne.mockReturnValueOnce({
      exec: () => Promise.resolve(mockResult),
    });

    const result = await service.findByCode('NB');
    expect(result).toEqual(mockResult);
    expect(mockModel.findOne).toHaveBeenCalledWith({
      code: 'NB',
      type: 'figure',
    });
  });

  it('should return a figure by id', async () => {
    const mockResult = { name: 'Napoleon Bonaparte', _id: 'abc' };
    mockModel.findOne.mockReturnValueOnce({
      exec: () => Promise.resolve(mockResult),
    });

    const result = await service.findById('abc');
    expect(result).toEqual(mockResult);
    expect(mockModel.findOne).toHaveBeenCalledWith({
      _id: 'abc',
      type: 'figure',
    });
  });
});

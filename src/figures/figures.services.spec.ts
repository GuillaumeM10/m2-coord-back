import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FigureService } from './figures.services';
import { QuizzDataFigures } from './schemas/quizzdata.schema';
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

  it('should create a new figure', async () => {
    const dto: CreateFigureDto = {
      name: 'Napoleon',
      image: 'url-to-image',
      type: 'figure',
    };

    mockSave.mockResolvedValue({ ...dto, _id: 'someid' });

    const result = await service.create(dto);

    expect(mockConstructor).toHaveBeenCalledWith({ ...dto, type: 'figure' });
    expect(mockSave).toHaveBeenCalled();
    expect(result).toMatchObject({ name: 'Napoleon', type: 'figure' });
  });

  it('should return all figures', async () => {
    const mockFigures = [{ name: 'Napoleon' }, { name: 'Caesar' }];
    mockModel.find.mockReturnValueOnce({
      exec: () => Promise.resolve(mockFigures),
    });

    const result = await service.findAll();
    expect(result).toEqual(mockFigures);
    expect(mockModel.find).toHaveBeenCalledWith({ type: 'figure' });
  });

  it('should return random figures', async () => {
    const sample = [{ name: 'Napoleon' }, { name: 'Caesar' }];
    mockModel.aggregate.mockResolvedValue(sample);

    const result = await service.getRandomFigures(2);
    expect(result).toEqual(sample);
    expect(mockModel.aggregate).toHaveBeenCalledWith([
      { $match: { type: 'figure' } },
      { $sample: { size: 2 } },
    ]);
  });

  it('should generate questions with shuffled choices', async () => {
    const allFigures = Array.from({ length: 50 }, (_, i) => ({
      name: `Figure${i}`,
      image: `image${i}.svg`,
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
      expect(new Set(q.choices).size).toBe(4);
    }
  });

  it('should return a figure by question and answer', async () => {
    const mockResult = { question: 'Who?', answer: 'Napoleon' };
    mockModel.findOne.mockReturnValueOnce({
      exec: () => Promise.resolve(mockResult),
    });

    const result = await service.findByCode('Who?', 'Napoleon');
    expect(result).toEqual(mockResult);
    expect(mockModel.findOne).toHaveBeenCalledWith({
      question: 'Who?',
      answer: 'Napoleon',
      type: 'figure',
    });
  });

  it('should return a figure by id', async () => {
    const mockResult = { name: 'Napoleon', _id: 'someid' };
    mockModel.findOne.mockReturnValueOnce({
      exec: () => Promise.resolve(mockResult),
    });

    const result = await service.findById('someid');
    expect(result).toEqual(mockResult);
    expect(mockModel.findOne).toHaveBeenCalledWith({
      _id: 'someid',
      type: 'figure',
    });
  });
});

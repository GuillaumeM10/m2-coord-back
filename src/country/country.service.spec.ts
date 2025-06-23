import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CountryService } from './country.service';
import { QuizzData } from './schemas/quizzdata.schema';
import { CreateCountryDto } from './dto/create-country.dto';

describe('CountryService', () => {
  let service: CountryService;

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
        CountryService,
        {
          provide: getModelToken(QuizzData.name),
          useValue: Object.assign(mockConstructor, mockModel), // 👈 combine constructeur et méthodes
        },
      ],
    }).compile();

    service = module.get<CountryService>(CountryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new country', async () => {
    const dto: CreateCountryDto = {
      name: 'France',
      code: 'FR',
      flagSvg: 'url',
      flagPng: 'url2',
    };

    mockSave.mockResolvedValue({ ...dto, _id: 'abc123', type: 'flag' });

    const result = await service.create(dto);

    expect(mockConstructor).toHaveBeenCalledWith({ ...dto, type: 'flag' });
    expect(mockSave).toHaveBeenCalled();
    expect(result).toMatchObject({ name: 'France', type: 'flag' });
  });

  it('should return all countries', async () => {
    const mockCountries = [{ name: 'France' }, { name: 'Germany' }];
    mockModel.find.mockReturnValueOnce({
      exec: () => Promise.resolve(mockCountries),
    });

    const result = await service.findAll();
    expect(result).toEqual(mockCountries);
    expect(mockModel.find).toHaveBeenCalledWith({ type: 'flag' });
  });

  it('should return random countries', async () => {
    const sample = [{ name: 'France' }, { name: 'Spain' }];
    mockModel.aggregate.mockResolvedValue(sample);

    const result = await service.getRandomCountries(2);
    expect(result).toEqual(sample);
    expect(mockModel.aggregate).toHaveBeenCalledWith([
      { $match: { type: 'flag' } },
      { $sample: { size: 2 } },
    ]);
  });

  it('should generate 20 questions with 4 shuffled choices', async () => {
    const allCountries = Array.from({ length: 50 }, (_, i) => ({
      name: `Country${i}`,
      flagSvg: `flag${i}.svg`,
      _id: `id${i}`,
    }));

    const correctCountries = allCountries.slice(0, 20);

    mockModel.aggregate.mockResolvedValue(correctCountries);
    mockModel.find.mockReturnValue({
      exec: () => Promise.resolve(allCountries),
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

  it('should return a country by code', async () => {
    const mockResult = { name: 'France', code: 'FR' };
    mockModel.findOne.mockReturnValueOnce({
      exec: () => Promise.resolve(mockResult),
    });

    const result = await service.findByCode('FR');
    expect(result).toEqual(mockResult);
    expect(mockModel.findOne).toHaveBeenCalledWith({
      code: 'FR',
      type: 'flag',
    });
  });

  it('should return a country by id', async () => {
    const mockResult = { name: 'France', _id: 'abc' };
    mockModel.findOne.mockReturnValueOnce({
      exec: () => Promise.resolve(mockResult),
    });

    const result = await service.findById('abc');
    expect(result).toEqual(mockResult);
    expect(mockModel.findOne).toHaveBeenCalledWith({
      _id: 'abc',
      type: 'flag',
    });
  });
});

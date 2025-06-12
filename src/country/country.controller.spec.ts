import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';

describe('CountryController', () => {
  let controller: CountryController;
  let service: CountryService;

  const mockService = {
    findAll: jest.fn(),
    getQuestions: jest.fn(),
    findByCode: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [{ provide: CountryService, useValue: mockService }],
    }).compile();

    controller = module.get<CountryController>(CountryController);
    service = module.get<CountryService>(CountryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all countries', async () => {
    const expected = [{ name: 'France' }, { name: 'Germany' }];
    mockService.findAll.mockResolvedValue(expected);

    const result = await controller.findAll();
    expect(result).toEqual(expected);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should return questions', async () => {
    const expected = [
      {
        id: '1',
        image: 'url',
        choices: ['France', 'Germany', 'Italy', 'Spain'],
      },
    ];
    mockService.getQuestions.mockResolvedValue(expected);

    const result = await controller.getQuestions();
    expect(result).toEqual(expected);
    expect(mockService.getQuestions).toHaveBeenCalled();
  });

  it('should return a country by code', async () => {
    const expected = { name: 'France', code: 'FR' };
    mockService.findByCode.mockResolvedValue(expected);

    const result = await controller.findByCode('FR');
    expect(result).toEqual(expected);
    expect(mockService.findByCode).toHaveBeenCalledWith('FR');
  });

  it('should create a country', async () => {
    const dto: CreateCountryDto = {
      name: 'France',
      code: 'FR',
      flagSvg: 'https://flags.com/fr.svg',
      flagPng: 'https://flags.com/fr.png',
    };

    const expected = { ...dto, _id: 'abc123' };
    mockService.create.mockResolvedValue(expected);

    const result = await controller.create(dto);
    expect(result).toEqual(expected);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });
});

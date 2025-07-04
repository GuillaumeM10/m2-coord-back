import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { InitDataService } from './initData.service';
import { QuizzData } from '../country/schemas/quizzdata.schema';
import { QuizzDataFigures } from '../figures/schemas/quizzdata.schema';
import { Game } from '../game/schemas/game.schema';
import { Logger } from '@nestjs/common';

describe('InitDataService', () => {
  let service: InitDataService;

  const mockCountryModel = {
    countDocuments: jest.fn(),
    insertMany: jest.fn(),
  };

  const mockFigureModel = {
    countDocuments: jest.fn(),
    insertMany: jest.fn(),
  };

  const mockGameModel = {
    countDocuments: jest.fn(),
    insertMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitDataService,
        {
          provide: getModelToken(QuizzData.name),
          useValue: mockCountryModel,
        },
        {
          provide: getModelToken(QuizzDataFigures.name),
          useValue: mockFigureModel,
        },
        {
          provide: getModelToken(Game.name),
          useValue: mockGameModel,
        },
      ],
    }).compile();

    service = module.get<InitDataService>(InitDataService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should skip flag initialization if data exists', async () => {
    mockCountryModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(10),
    });

    const loggerSpy = jest.spyOn(Logger.prototype, 'log');

    await service.initializeData();

    expect(loggerSpy).toHaveBeenCalledWith(
      'Found 10 flags in database. Skipping initialization.',
    );
    expect(mockCountryModel.insertMany).not.toHaveBeenCalled();
  });

  it('should initialize flags when database is empty', async () => {
    mockCountryModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(0),
    });
    mockCountryModel.insertMany.mockResolvedValue([]);

    const loggerSpy = jest.spyOn(Logger.prototype, 'log');

    await service.initializeData();

    expect(loggerSpy).toHaveBeenCalledWith(
      'No flag data found in database. Initializing from JSON...',
    );
    expect(mockCountryModel.insertMany).toHaveBeenCalled();
  });

  it('should skip figure initialization if data exists', async () => {
    mockCountryModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(1),
    });
    mockFigureModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(5),
    });

    const loggerSpy = jest.spyOn(Logger.prototype, 'log');

    await service.initializeData();

    expect(loggerSpy).toHaveBeenCalledWith(
      'Found 5 figures in database. Skipping initialization.',
    );
    expect(mockFigureModel.insertMany).not.toHaveBeenCalled();
  });

  it('should initialize figures when database is empty', async () => {
    mockCountryModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(1),
    });
    mockFigureModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(0),
    });
    mockFigureModel.insertMany.mockResolvedValue([]);

    const loggerSpy = jest.spyOn(Logger.prototype, 'log');

    await service.initializeData();

    expect(loggerSpy).toHaveBeenCalledWith(
      'No figure data found in database. Initializing from JSON...',
    );
    expect(mockFigureModel.insertMany).toHaveBeenCalled();
  });

  it('should skip games initialization if data exists', async () => {
    mockCountryModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(1),
    });
    mockFigureModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(1),
    });
    mockGameModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(2),
    });

    const loggerSpy = jest.spyOn(Logger.prototype, 'log');

    await service.initializeData();

    expect(loggerSpy).toHaveBeenCalledWith(
      'Found 2 games in database. Skipping initialization.',
    );
    expect(mockGameModel.insertMany).not.toHaveBeenCalled();
  });

  it('should initialize games when database is empty', async () => {
    mockCountryModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(1),
    });
    mockFigureModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(1),
    });
    mockGameModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(0),
    });
    mockGameModel.insertMany.mockResolvedValue([]);

    const loggerSpy = jest.spyOn(Logger.prototype, 'log');

    await service.initializeData();

    expect(loggerSpy).toHaveBeenCalledWith(
      'No games found in database. Initializing from JSON...',
    );
    expect(mockGameModel.insertMany).toHaveBeenCalled();
  });

  it('should handle errors during initialization', async () => {
    mockCountryModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(0),
    });
    mockCountryModel.insertMany.mockRejectedValue(new Error('Database error'));

    const loggerSpy = jest.spyOn(Logger.prototype, 'error');

    await service.initializeData();

    expect(loggerSpy).toHaveBeenCalledWith(
      'Failed to initialize flag data',
      expect.any(String),
    );
  });
});

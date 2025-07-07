import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { GamesService } from './games.service';
import { Game } from './schemas/game.schema';
import { GameModes } from './enum/gameModes.enum';

describe('GamesService', () => {
  let service: GamesService;

  const mockSave = jest.fn();
  const mockConstructor = jest.fn(() => ({ save: mockSave }));
  const mockModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getModelToken(Game.name),
          useValue: Object.assign(mockConstructor, mockModel),
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new game', async () => {
    const gameData = {
      key: 'test-game',
      name: 'Test Game',
      photoUrl: 'test.png',
      modes: [GameModes.CLASSIC], // Use the enum instead of string
    };

    mockSave.mockResolvedValue({ ...gameData, _id: 'abc123' });

    const result = await service.create(gameData);

    expect(mockConstructor).toHaveBeenCalledWith(gameData);
    expect(mockSave).toHaveBeenCalled();
    expect(result).toMatchObject({ key: 'test-game', name: 'Test Game' });
  });

  it('should return all games', async () => {
    const mockGames = [
      { key: 'game1', name: 'Game 1' },
      { key: 'game2', name: 'Game 2' },
    ];
    mockModel.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockGames),
    });

    const result = await service.findAll();
    expect(result).toEqual(mockGames);
    expect(mockModel.find).toHaveBeenCalled();
  });

  it('should return a game by id', async () => {
    const mockGame = { key: 'game1', name: 'Game 1', _id: 'abc' };
    mockModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockGame),
    });

    const result = await service.findOne('abc');
    expect(result).toEqual(mockGame);
    expect(mockModel.findById).toHaveBeenCalledWith('abc');
  });

  it('should delete a game', async () => {
    const mockGame = { key: 'game1', name: 'Game 1', _id: 'abc' };
    mockModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockGame),
    });

    const result = await service.delete('abc');
    expect(result).toEqual(mockGame);
    expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('abc');
  });
});

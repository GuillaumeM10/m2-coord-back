import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { CreateGameDto, GameDto } from './dto/game.dto';
import { GameModes } from './enum/gameModes.enum';

describe('GamesController', () => {
  let controller: GamesController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    delete: jest.Mock;
  };

  const mockGameDocument = {
    _id: { toString: () => 'someId' },
    key: 'someKey',
    name: 'Test Game',
    photoUrl: 'photo.jpg',
    modes: [GameModes.CLASSIC],
  };

  const mockGameDto: GameDto = {
    id: 'someId',
    key: 'someKey',
    name: 'Test Game',
    photoUrl: 'photo.jpg',
    modes: [GameModes.CLASSIC],
  };

  const mockGames = [mockGameDocument];

  beforeEach(async () => {
    service = {
      create: jest.fn().mockResolvedValue(mockGameDocument),
      findAll: jest.fn().mockResolvedValue(mockGames),
      findOne: jest.fn().mockResolvedValue(mockGameDocument),
      delete: jest.fn().mockResolvedValue(mockGameDocument),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
  });

  it('should create a game and return GameDto', async () => {
    const createDto: CreateGameDto = {
      name: 'Test Game',
      photoUrl: 'photo.jpg',
      modes: [GameModes.CLASSIC],
    };

    const result = await controller.create(createDto);
    expect(service.create).toHaveBeenCalledWith(createDto);
    expect(result).toEqual(mockGameDto);
  });

  it('should return all games', async () => {
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockGameDto]);
  });

  it('should return a game by id', async () => {
    const result = await controller.findOne('someId');
    expect(service.findOne).toHaveBeenCalledWith('someId');
    expect(result).toEqual(mockGameDto);
  });

  it('should delete a game and return GameDto', async () => {
    const result = await controller.delete('someId');
    expect(service.delete).toHaveBeenCalledWith('someId');
    expect(result).toEqual(mockGameDto);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';

describe('GamesService', () => {
  let service: GamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamesService],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  // TODO: Pass the test
  xit('should be defined', () => {
    expect(service).toBeDefined();
  });
});

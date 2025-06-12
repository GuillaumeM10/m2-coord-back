import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AnswerService } from './answer.service';
import { QuizzData } from '../country/schemas/quizzdata.schema';
import { ValidateAnswerDto } from './dto/validate-answer.dto';

describe('AnswerService', () => {
  let service: AnswerService;

  const mockModel = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswerService,
        {
          provide: getModelToken(QuizzData.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<AnswerService>(AnswerService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if the answer is correct (case-insensitive, trimmed)', async () => {
    const mockDoc = {
      name: 'France',
    };
    mockModel.findOne.mockReturnValueOnce({
      exec: () => Promise.resolve(mockDoc),
    });

    const dto: ValidateAnswerDto = {
      questionId: '123abc',
      answer: '  france ',
    };

    const result = await service.validate(dto);
    expect(result).toEqual({ isAnswerCorrect: true });
  });

  it('should return false if the answer is incorrect', async () => {
    const mockDoc = {
      name: 'France',
    };
    mockModel.findOne.mockReturnValueOnce({
      exec: () => Promise.resolve(mockDoc),
    });

    const dto: ValidateAnswerDto = {
      questionId: '123abc',
      answer: 'Germany',
    };

    const result = await service.validate(dto);
    expect(result).toEqual({ isAnswerCorrect: false });
  });

  it('should return false if question is not found', async () => {
    mockModel.findOne.mockReturnValueOnce({
      exec: () => Promise.resolve(null),
    });

    const dto: ValidateAnswerDto = {
      questionId: 'nonexistent',
      answer: 'France',
    };

    const result = await service.validate(dto);
    expect(result).toEqual({ isAnswerCorrect: false });
  });
});

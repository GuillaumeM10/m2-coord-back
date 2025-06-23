import { Test, TestingModule } from '@nestjs/testing';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { ValidateAnswerDto } from './dto/validate-answer.dto';

describe('AnswerController', () => {
  let controller: AnswerController;
  const mockService = {
    validate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerController],
      providers: [{ provide: AnswerService, useValue: mockService }],
    }).compile();

    controller = module.get<AnswerController>(AnswerController);
  });

  it('should call validate() and return result', async () => {
    const dto: ValidateAnswerDto = {
      questionId: '123',
      answer: 'France',
    };
    const mockResult = { isAnswerCorrect: true };
    mockService.validate.mockResolvedValueOnce(mockResult);

    const result = await controller.validate(dto);
    expect(result).toEqual(mockResult);
    expect(mockService.validate).toHaveBeenCalledWith(dto);
  });
});

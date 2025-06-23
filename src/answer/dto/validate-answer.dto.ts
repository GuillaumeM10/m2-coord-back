// src/answer/dto/validate-answer.dto.ts
import { IsString } from 'class-validator';

export class ValidateAnswerDto {
  @IsString()
  questionId: string;

  @IsString()
  answer: string;
}

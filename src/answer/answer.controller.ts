// src/answer/answer.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { ValidateAnswerDto } from './dto/validate-answer.dto';

@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post('validate')
  async validate(@Body() dto: ValidateAnswerDto) {
    return this.answerService.validate(dto);
  }

  @Get('correct/:questionId')
  async getCorrectAnswer(@Param('questionId') questionId: string) {
    return this.answerService.getCorrectAnswer(questionId);
  }
}

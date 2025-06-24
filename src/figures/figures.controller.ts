import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateFigureDto } from './dto/figures.dto';
import { FigureService } from './figures.services';

@Controller('figures')
export class FigureController {
  constructor(private readonly figureService: FigureService) {}

  @Get()
  findAll() {
    return this.figureService.findAll();
  }

  @Get('questions')
  getQuestions() {
    return this.figureService.getQuestions();
  }

  @Get(':code')
  findByCode(@Param('code') question: string, answer: string) {
    return this.figureService.findByCode(question, answer);
  }

  @Post()
  create(@Body() dto: CreateFigureDto) {
    return this.figureService.create(dto);
  }
}

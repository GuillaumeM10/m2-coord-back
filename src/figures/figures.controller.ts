import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateFigureDto } from './dto/figures.dto';
import { FigureService } from './figures.services';

@Controller('countries')
export class FigureController {
  constructor(private readonly countryService: FigureService) {}

  @Get()
  findAll() {
    return this.countryService.findAll();
  }

  @Get('questions')
  getQuestions() {
    return this.countryService.getQuestions();
  }

  @Get(':code')
  findByCode(@Param('code') question: string, answer: string) {
    return this.countryService.findByCode(question, answer);
  }

  @Post()
  create(@Body() dto: CreateFigureDto) {
    return this.countryService.create(dto);
  }
}

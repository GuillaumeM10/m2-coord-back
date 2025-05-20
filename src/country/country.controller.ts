import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  findAll() {
    return this.countryService.findAll();
  }

  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.countryService.findByCode(code);
  }

  @Post()
  create(@Body() dto: CreateCountryDto) {
    return this.countryService.create(dto);
  }
}

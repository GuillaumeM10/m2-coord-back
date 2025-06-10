import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from './schemas/country.schema';
import { CreateCountryDto } from './dto/create-country.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<Country>,
  ) {}

  async create(dto: CreateCountryDto) {
    const country = new this.countryModel(dto);
    return country.save();
  }

  async findAll() {
    const countries = await this.countryModel.find().exec();
    console.log('>>> [CountryService] countries found:', countries.length);
    return countries;
  }

  async findByCode(code: string) {
    return this.countryModel.findOne({ code }).exec();
  }
}

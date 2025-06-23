// src/country/country.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizzData } from './schemas/quizzdata.schema';
import { CreateCountryDto } from './dto/create-country.dto';

export interface FlagQuestionChoice {
  id: string;
  image: string;
  choices: string[];
}

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(QuizzData.name) private countryModel: Model<QuizzData>,
  ) {}

  async create(dto: CreateCountryDto) {
    const country = new this.countryModel({ ...dto, type: 'flag' });
    return country.save();
  }

  async findAll() {
    const countries = await this.countryModel.find({ type: 'flag' }).exec();
    console.log('>>> [CountryService] countries found:', countries.length);
    return countries;
  }

  async getRandomCountries(count = 20): Promise<QuizzData[]> {
    const countries = await this.countryModel.aggregate<QuizzData>([
      { $match: { type: 'flag' } },
      { $sample: { size: count } },
    ]);
    return countries;
  }

  async getQuestions(): Promise<FlagQuestionChoice[]> {
    const correctCountries = await this.getRandomCountries(20);
    const allCountries = await this.countryModel.find({ type: 'flag' }).exec();

    return correctCountries.map((correct) => {
      const incorrect = allCountries
        .filter((c) => c.name !== correct.name)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((c) => c.name);

      const allChoices = [correct.name, ...incorrect].sort(
        () => 0.5 - Math.random(),
      );

      return {
        id: correct._id as string,

        image: correct.flagSvg || '',
        choices: allChoices,
      };
    });
  }

  async findByCode(code: string) {
    return this.countryModel.findOne({ code, type: 'flag' }).exec();
  }

  async findById(id: string): Promise<QuizzData | null> {
    return this.countryModel.findOne({ _id: id, type: 'flag' }).exec();
  }
}

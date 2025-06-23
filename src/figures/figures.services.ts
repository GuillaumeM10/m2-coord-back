// src/country/country.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizzDataFigures } from './schemas/quizzdata.schema';
import { CreateFigureDto } from './dto/figures.dto';

export interface QuestionChoice {
  id: string;
  image: string;
  choices: string[];
}

@Injectable()
export class FigureService {
  constructor(
    @InjectModel(QuizzDataFigures.name)
    private figureModel: Model<QuizzDataFigures>,
  ) {}

  async create(dto: CreateFigureDto) {
    const figure = new this.figureModel({ ...dto, type: 'figure' });
    return figure.save();
  }

  async findAll() {
    const figures = await this.figureModel.find({ type: 'figure' }).exec();
    console.log('>>> [FigureService] figures found:', figures.length);
    return figures;
  }

  async getRandomCountries(count = 20): Promise<QuizzDataFigures[]> {
    const figures = await this.figureModel.aggregate<QuizzDataFigures>([
      { $match: { type: 'figure' } },
      { $sample: { size: count } },
    ]);
    return figures;
  }

  async getQuestions(): Promise<QuestionChoice[]> {
    const correctCountries = await this.getRandomCountries(20);
    const allCountries = await this.figureModel.find({ type: 'figure' }).exec();

    return correctCountries.map((correct) => {
      const incorrect = allCountries
        .filter((c) => c.question !== correct.question)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((c) => c.question);

      const allChoices = [correct.question, ...incorrect]
        .filter((choice) => choice !== undefined)
        .sort(() => 0.5 - Math.random());

      return {
        id: correct._id as string,
        image: correct.answer || '',
        choices: allChoices,
      };
    });
  }

  async findByCode(question: string, answer: string) {
    return this.figureModel
      .findOne({ question, answer, type: 'figure' })
      .exec();
  }

  async findById(id: string): Promise<QuizzDataFigures | null> {
    return this.figureModel.findOne({ _id: id, type: 'figure' }).exec();
  }
}

// src/country/country.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizzDataFigures } from './schemas/quizzdata.schema';
import { CreateFigureDto } from './dto/figures.dto';
import { shuffleArray } from 'src/country/country.service';

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

  async getRandomFigures(count = 20): Promise<QuizzDataFigures[]> {
    const figures = await this.figureModel.aggregate<QuizzDataFigures>([
      { $match: { type: 'figure' } },
      { $sample: { size: count } },
    ]);
    return figures;
  }

  async getQuestions(): Promise<QuestionChoice[]> {
    const correctFigures = await this.getRandomFigures(20);
    const allFigures = await this.figureModel.find({ type: 'figure' }).exec();

    return correctFigures.map((correct) => {
      const incorrect = shuffleArray(
        allFigures.filter((c) => c.question !== correct.question),
      )
        .slice(0, 3)
        .map((c) => c.question);

      const allChoices = shuffleArray(
        [correct.question, ...incorrect].filter(
          (choice) => choice !== undefined,
        ),
      );

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

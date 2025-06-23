import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuizzData } from '../country/schemas/quizzdata.schema';
import { Model } from 'mongoose';
import { ValidateAnswerDto } from './dto/validate-answer.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(QuizzData.name) private readonly model: Model<QuizzData>,
  ) {}

  async validate(
    dto: ValidateAnswerDto,
  ): Promise<{ isAnswerCorrect: boolean }> {
    const doc = await this.model
      .findOne({ _id: dto.questionId, type: 'flag' })
      .exec();
    if (!doc) return { isAnswerCorrect: false };

    const isCorrect =
      doc.name.trim().toLowerCase() === dto.answer.trim().toLowerCase();
    return { isAnswerCorrect: isCorrect };
  }
}

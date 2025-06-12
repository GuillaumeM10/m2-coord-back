// src/answer/answer.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import {
  QuizzData,
  QuizzDataSchema,
} from '../country/schemas/quizzdata.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizzData.name, schema: QuizzDataSchema },
    ]),
  ],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}

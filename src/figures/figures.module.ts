import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuizzDataFigures,
  QuizzDataFigureSchema,
} from './schemas/quizzdata.schema';
import { FigureController } from './figures.controller';
import { FigureService } from './figures.services';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizzDataFigures.name, schema: QuizzDataFigureSchema },
    ]),
  ],
  controllers: [FigureController],
  providers: [FigureService],
  exports: [FigureService],
})
export class FigureModule {}

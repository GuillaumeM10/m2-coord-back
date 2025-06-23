import { Module } from '@nestjs/common';
import { InitDataService } from './initData.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuizzData,
  QuizzDataSchema,
} from 'src/country/schemas/quizzdata.schema';
import {
  QuizzDataFigures,
  QuizzDataFigureSchema,
} from 'src/figures/schemas/quizzdata.schema';
import { Game, GameSchema } from 'src/game/schemas/game.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizzData.name, schema: QuizzDataSchema },
      { name: QuizzDataFigures.name, schema: QuizzDataFigureSchema },
      { name: Game.name, schema: GameSchema },
    ]),
  ],
  providers: [InitDataService],
  controllers: [],
})
export class InitDataModule {}

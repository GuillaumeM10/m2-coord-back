import { Module } from '@nestjs/common';
import { InitDataService } from './initData.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuizzData,
  QuizzDataSchema,
} from 'src/country/schemas/quizzdata.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizzData.name, schema: QuizzDataSchema },
    ]),
  ],
  providers: [InitDataService],
  controllers: [],
})
export class InitDataModule {}

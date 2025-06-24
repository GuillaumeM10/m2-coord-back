// src/country/schemas/quizzdata.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'quizzdata' })
export class QuizzDataFigures extends Document {
  @Prop({ required: true }) image?: string;
  @Prop({ required: true }) name?: string;

  @Prop({ required: true }) type: string;
}

export const QuizzDataFigureSchema =
  SchemaFactory.createForClass(QuizzDataFigures);

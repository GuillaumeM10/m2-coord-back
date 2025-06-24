import { IsString } from 'class-validator';

export class CreateFigureDto {
  @IsString()
  question: string;

  @IsString()
  answer: string;

  @IsString()
  type?: string;
}

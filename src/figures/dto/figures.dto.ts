import { IsString } from 'class-validator';

export class CreateFigureDto {
  @IsString()
  image: string;

  @IsString()
  name: string;

  @IsString()
  type?: string;
}

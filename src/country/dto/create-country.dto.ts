import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  subregion?: string;

  @IsOptional()
  @IsString()
  flagSvg?: string;

  @IsOptional()
  @IsString()
  flagPng?: string;

  @IsOptional()
  @IsObject()
  coordinates?: {
    lat: number;
    lng: number;
  };

  @IsOptional()
  @IsObject()
  geoJson?: any;

  @IsOptional()
  @IsString()
  type?: string;
}

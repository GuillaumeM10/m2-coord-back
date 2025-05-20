import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Country extends Document {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) code: string;
  @Prop() region?: string;
  @Prop() subregion?: string;
  @Prop() flagSvg?: string;
  @Prop() flagPng?: string;

  @Prop({ type: { lat: Number, lng: Number }, required: false })
  coordinates?: { lat: number; lng: number };

  @Prop({ type: Object })
  geoJson?: any;
}

export const CountrySchema = SchemaFactory.createForClass(Country);

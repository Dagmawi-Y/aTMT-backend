import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Category extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  image: string;

  @Prop({ type: [String], required: true })
  subcategories: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);

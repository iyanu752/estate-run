import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ required: true })
  count: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

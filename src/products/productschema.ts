import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: false })
  unit: string;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ required: false })
  quantity: number;

  @Prop({ required: false })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'Supermarket' })
  supermarket: string;

  @Prop({ required: false })
  isAvailable: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Supermarket' })
  ownerId: string;
}

export const Products = SchemaFactory.createForClass(Product);

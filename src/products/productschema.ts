import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

  @Prop({ required: false })
  price: number;

  @Prop({ required: true })
  location: string;

  @Prop({ default: 0 })
  stock: number;

  @Prop()
  image: string;

  @Prop({ required: false })
  method: string;
}

export const Products = SchemaFactory.createForClass(Product);

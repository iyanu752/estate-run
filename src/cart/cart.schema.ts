import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ _id: false })
export class CartItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: Types.ObjectId;

  @Prop({ type: Number, required: true, default: 1 })
  quantity: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supermarket',
    required: false,
  })
  Supermarket: Types.ObjectId;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

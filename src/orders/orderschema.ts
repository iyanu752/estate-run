import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Orders {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
      },
    ],
    required: true,
  })
  items: {
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({
    type: String,
    enum: [
      'pending',
      'confirmed',
      'out-for-delivery',
      'delivered',
      'cancelled',
    ],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Date })
  deliveredAt: Date;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);

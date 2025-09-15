import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Orders extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        supermarket: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'SuperMarket',
        },
      },
    ],
    required: true,
  })
  items: {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
    supermarket: mongoose.Schema.Types.ObjectId;
  }[];

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({ type: String, required: true })
  deliveryAddress: string;

  @Prop({ type: String })
  deliveryInstructions: string;

  @Prop({
    type: String,
    enum: [
      'pending',
      'confirmed',
      'packed',
      'out-for-delivery',
      'delivered',
      'cancelled',
      'payment-failed',
    ],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Date })
  deliveredAt: Date;

  @Prop({ type: String, unique: true })
  paymentReference: string;

  @Prop({
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  })
  paymentStatus: string;

  @Prop({ type: String })
  orderId: string;

  @Prop({ type: Date })
  paidAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedRider?: Types.ObjectId;

  @Prop({ type: Date })
  cancelledAt: Date;

  @Prop({ type: String })
  supermarketId: string;
  @Prop({ type: String })
  verificationCode: string;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);

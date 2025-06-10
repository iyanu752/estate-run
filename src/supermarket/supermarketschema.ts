import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type SuperMarketDocument = SuperMarket & Document;

@Schema({ timestamps: true })
export class SuperMarket {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  ownerId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  approved: boolean;
}

export const SupermarketSchema = SchemaFactory.createForClass(SuperMarket);

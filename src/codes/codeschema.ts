import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
// import mongoose, { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Code {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  visitorName: string;

  @Prop({ required: false })
  visitorPhone: number;

  @Prop({ required: false })
  purposeOfVisit: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  from: string;
  @Prop({ required: true })
  to: string;

  @Prop({ required: false })
  specialInstructions: string;

  @Prop({ required: false })
  verificationCode: number;

  @Prop({ type: String, enum: ['Active', 'Used'], default: 'Active' })
  codeStatus: string;
}

export const Codes = SchemaFactory.createForClass(Code);

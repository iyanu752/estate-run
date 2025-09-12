import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Code {
  @Prop({ required: true, trim: true })
  visitorName: string;

  @Prop({ required: false })
  visitorPhone: number;

  @Prop({ required: false })
  purposeOfVisit: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  from: number;
  @Prop({ required: true })
  to: number;

  @Prop({ required: false })
  specialInstructions: string;

  @Prop({ required: false })
  verificationCode: number;
}

export const Codes = SchemaFactory.createForClass(Code);

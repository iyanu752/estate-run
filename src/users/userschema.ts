import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: false, trim: true })
  businessName: string;

  @Prop({ required: false, trim: true })
  businessPhoneNumber: string;

  @Prop({ required: false, trim: true })
  businessAddress: string;

  @Prop({ required: false, trim: true })
  businessDescription: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email',
    ],
  })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, enum: ['user', 'vendor', 'rider', 'admin'] })
  userType: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Supermarket' })
  supermarket: mongoose.Schema.Types.ObjectId;

  @Prop()
  phone: number;

  @Prop()
  address: string;

  @Prop({ required: false })
  bankAccountNumber?: number;

  @Prop({ required: false })
  bankName?: string;

  @Prop({ required: false })
  bankAccountName?: string;

  @Prop()
  profileImage: string;

  @Prop()
  estate?: string;

  @Prop()
  rating?: number;

  @Prop({
    required: false,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  })
  status: string;

  @Prop({ required: false, default: false })
  isLoggedIn: boolean;
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

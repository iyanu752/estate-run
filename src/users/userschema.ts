import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

  @Prop({ required: false })
  supermarket: string;

  @Prop({ required: false, enum: ['open', 'closed'] })
  status: string;

  @Prop()
  phone: number;

  @Prop()
  address: string;

  @Prop()
  profileImage: string;

  @Prop()
  estate: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

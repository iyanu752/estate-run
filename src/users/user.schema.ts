import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

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

  @Prop({ required: true, enum: ['user', 'business_owner'] })
  userType: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

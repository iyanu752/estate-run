import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: [true, 'This email is already in use'] })
  email: string;

  @Prop()
  password: string;

  @Prop()
  userType: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

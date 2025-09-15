import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Document } from 'mongoose';

export type NewsDocument = News & Document;

class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: String, trim: true, required: true })
  comment: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

@Schema({ timestamps: true })
export class News {
  @Prop({ required: false, trim: true })
  headline: string;

  @Prop({ required: false, trim: true })
  message: string;

  @Prop({ required: false })
  image: string;

  @Prop({ default: false })
  isLiked: boolean;

  @Prop({ type: [Comment], default: [] })
  comments: Types.DocumentArray<Comment>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);

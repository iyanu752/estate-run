import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { News, NewsDocument } from './newsSchema';
import { User, UserDocument } from 'src/users/userschema';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private notificationGateway: NotificationsGateway,
  ) {}

  async createNews(
    userId: string,
    headline: string,
    message: string,
  ): Promise<News> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) throw new NotFoundException('User not found');

      const news = new this.newsModel({
        user: userId,
        headline,
        message,
      });

      const savedNews = await news.save();
      if (user.estate) {
        const estateUsers = await this.userModel
          .find<{ _id: Types.ObjectId }>({ estate: user.estate }, '_id')
          .lean()
          .exec();

        estateUsers.forEach((u) => {
          this.notificationGateway.server
            .to(
              u._id instanceof Types.ObjectId
                ? u._id.toHexString()
                : typeof u._id === 'string'
                  ? u._id
                  : (u._id as Types.ObjectId).toHexString(),
            )
            .emit('estateNewsNotification', {
              headline,
              message,
              estate: user.estate,
              createdBy: user.firstName,
            });
        });
      }

      return savedNews;
    } catch (error) {
      console.error('error creating news', error);
      throw new InternalServerErrorException('Failed to create news', error);
    }
  }

  async getNewsByEstate(estate: string): Promise<any[]> {
    try {
      const estateUsers = await this.userModel
        .find({ estate }, '_id')
        .lean()
        .exec();

      const userIds = estateUsers.map((u) =>
        u._id instanceof Types.ObjectId
          ? u._id.toHexString()
          : (u._id as string),
      );

      if (userIds.length === 0) {
        return [];
      }

      const newsList = await this.newsModel
        .find({ user: { $in: userIds } })
        .populate('user', 'firstName lastName estate')
        .lean()
        .exec();

      return newsList.map((news) => ({
        _id: news._id,
        headline: news.headline,
        message: news.message,
        isLiked: news.isLiked,
        createdAt: news.createdAt,
        user: news.user,
        comments: news.comments.map((c) => ({
          _id: c._id,
          comment: c.comment,
          createdAt: c.createdAt,
          user: c.user,
        })),
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch estate news',
        error,
      );
    }
  }

  async editNews(newsId: string, updates: Partial<News>): Promise<News> {
    const news = await this.newsModel.findByIdAndUpdate(newsId, updates, {
      new: true,
    });
    if (!news) throw new NotFoundException('News not found');
    return news;
  }

  async deleteNews(newsId: string): Promise<{ message: string }> {
    const deleted = await this.newsModel.findByIdAndDelete(newsId);
    if (!deleted) throw new NotFoundException('News not found');
    return { message: 'News deleted successfully' };
  }

  async likeNews(newsId: string): Promise<News> {
    const news = await this.newsModel.findById(newsId);
    if (!news) throw new NotFoundException('News not found');
    news.isLiked = !news.isLiked;
    return news.save();
  }

  async addComment(
    newsId: string,
    userId: string,
    comment: string,
  ): Promise<News> {
    const news = await this.newsModel.findById(newsId);
    if (!news) throw new NotFoundException('News not found');
    news.comments.push({ user: userId, comment, createdAt: new Date() });
    return news.save();
  }

  async editComment(
    newsId: string,
    commentId: string,
    newComment: string,
  ): Promise<News> {
    const news = await this.newsModel.findById(newsId);
    if (!news) throw new NotFoundException('News not found');
    const comment = news.comments.id(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    comment.comment = newComment;
    return news.save();
  }

  async deleteComment(newsId: string, commentId: string): Promise<News> {
    const news = await this.newsModel.findById(newsId);
    if (!news) throw new NotFoundException('News not found');
    const comment = news.comments.id(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    comment.deleteOne();
    return news.save();
  }
}

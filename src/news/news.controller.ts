import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './newsSchema';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Post()
  async createNews(
    @Body('userId') userId: string,
    @Body('headline') headline: string,
    @Body('message') message: string,
  ): Promise<News> {
    return this.newsService.createNews(userId, headline, message);
  }

  @Get('estate/:estate')
  async getNewsByEstate(@Param('estate') estate: string): Promise<any[]> {
    return this.newsService.getNewsByEstate(estate);
  }

  @Patch(':newsId')
  async editNews(
    @Param('newsId') newsId: string,
    @Body() updates: Partial<News>,
  ): Promise<News> {
    return this.newsService.editNews(newsId, updates);
  }

  @Delete(':newsId')
  async deleteNews(
    @Param('newsId') newsId: string,
  ): Promise<{ message: string }> {
    return this.newsService.deleteNews(newsId);
  }

  @Post(':newsId/like')
  async likeNews(@Param('newsId') newsId: string): Promise<News> {
    return this.newsService.likeNews(newsId);
  }

  @Post(':newsId/comments')
  async addComment(
    @Param('newsId') newsId: string,
    @Body('userId') userId: string,
    @Body('comment') comment: string,
  ): Promise<News> {
    return this.newsService.addComment(newsId, userId, comment);
  }

  @Put(':newsId/comments/:commentId')
  async editComment(
    @Param('newsId') newsId: string,
    @Param('commentId') commentId: string,
    @Body('newComment') newComment: string,
  ): Promise<News> {
    return this.newsService.editComment(newsId, commentId, newComment);
  }

  @Delete(':newsId/comments/:commentId')
  async deleteComment(
    @Param('newsId') newsId: string,
    @Param('commentId') commentId: string,
  ): Promise<News> {
    return this.newsService.deleteComment(newsId, commentId);
  }
}

import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsSchema } from './newsSchema';
import { User, UserSchema } from 'src/users/userschema';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'News', schema: NewsSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [NewsController],
  providers: [NewsService, NotificationsGateway],
})
export class NewsModule {}

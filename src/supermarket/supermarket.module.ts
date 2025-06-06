import { Module } from '@nestjs/common';
import { SupermarketService } from './supermarket.service';
import { SupermarketController } from './supermarket.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SuperMarket, SupermarketSchema } from './supermarketschema';
import { User, UserSchema } from 'src/users/userschema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SuperMarket.name, schema: SupermarketSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [SupermarketService],
  controllers: [SupermarketController],
})
export class SupermarketModule {}

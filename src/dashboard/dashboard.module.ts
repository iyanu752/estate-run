import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { OrdersSchema } from 'src/orders/orderschema';
import { Products } from 'src/products/productschema';
import { UserSchema } from 'src/users/userschema';
import { MongooseModule } from '@nestjs/mongoose';
import { SupermarketSchema } from 'src/supermarket/supermarketschema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Orders', schema: OrdersSchema },
      { name: 'Product', schema: Products },
      { name: 'User', schema: UserSchema },
      { name: 'SuperMarket', schema: SupermarketSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

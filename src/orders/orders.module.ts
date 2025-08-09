import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PaymentService } from 'src/payment/payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersSchema } from './orderschema';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from 'src/cart/cart.module';
import { User, UserSchema } from 'src/users/userschema';
import {
  SuperMarket,
  SupermarketSchema,
} from 'src/supermarket/supermarketschema';
import { VerificationService } from 'src/verification/verification.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
// import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Orders', schema: OrdersSchema },
      { name: User.name, schema: UserSchema },
      { name: SuperMarket.name, schema: SupermarketSchema },
    ]),
    ConfigModule,
    CartModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PaymentService,
    VerificationService,
    NotificationsGateway,
  ],
  exports: [OrdersService, PaymentService],
})
export class OrdersModule {}

import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Products } from 'src/products/productschema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Product',
        schema: Products,
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

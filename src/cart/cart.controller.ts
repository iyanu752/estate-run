import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.schema';
import { AddToCartDato } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get('/:id')
  async getCart(@Param('id') userId: string): Promise<Cart> {
    return await this.cartService.getCartByUserId(userId);
  }

  @Post(':id')
  async addToCart(
    @Param('id') userId: string,
    @Body() body: AddToCartDato,
  ): Promise<{ cart: any; message: string }> {
    return await this.cartService.addToCart({ ...body, userId });
  }

  @Put(':id/:productId/:quantity')
  async updateCart(
    @Param('id') userId: string,
    @Param('productId') productId: string,
    @Param('quantity') quantity: number,
  ): Promise<{ cart: any; message: string }> {
    return await this.cartService.updateCartItem(userId, productId, quantity);
  }

  @Delete(':id/:productId')
  async removeFromCart(
    @Param('id') userId: string,
    @Param('productId') productId: string,
  ): Promise<{ cart: any; message: string }> {
    return await this.cartService.removeFromCart(userId, productId);
  }

  @Delete(':id')
  async clearCart(@Param('id') userId: string): Promise<{ message: any }> {
    return await this.cartService.clearCart(userId);
  }

  @Get('/cardCount/:id')
  async getCartCount(@Param('id') userId: string): Promise<{ count: number }> {
    return await this.cartService.getCartCount(userId);
  }

  @Get('/cartTotal/:id')
  async getCartTotal(@Param('id') userId: string): Promise<{ total: number }> {
    return await this.cartService.getCartTotal(userId);
  }
}

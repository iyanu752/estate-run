import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get('/:id')
  async getCart(@Param('id') userId: string): Promise<{ cart: any }> {
    const cart = await this.cartService.getCartByUserId(userId);
    return {
      cart: cart,
    };
  }

  @Post(':id/:productId/:quantity')
  async addToCart(
    @Param('id') userId: string,
    @Param('productId') productId: string,
    @Param('quantity') quantity: number,
  ): Promise<{ cart: any }> {
    const cart = await this.cartService.addToCart(userId, productId, quantity);
    return {
      cart: cart,
    };
  }

  @Put(':id/:productId/:quantity')
  async updateCart(
    @Param('id') userId: string,
    @Param('productId') productId: string,
    @Param('quantity') quantity: number,
  ): Promise<{ cart: any }> {
    const cart = await this.cartService.updateCartItem(
      userId,
      productId,
      quantity,
    );
    return {
      cart: cart,
    };
  }

  @Delete(':id/:productId')
  async removeFromCart(
    @Param('id') userId: string,
    @Param('productId') productId: string,
  ): Promise<{ cart: any }> {
    const cart = await this.cartService.removeFromCart(userId, productId);
    return {
      cart: cart,
    };
  }

  @Delete(':id')
  async clearCart(@Param('id') userId: string): Promise<{ message: any }> {
    await this.cartService.clearCart(userId);
    return {
      message: 'Cart cleared successfully',
    };
  }

  @Get('/cardCount/:id')
  async getCartCount(@Param('id') userId: string): Promise<{ count: number }> {
    const cart = await this.cartService.getCartCount(userId);
    return {
      count: cart,
    };
  }

  @Get('/cartTotal/:id')
  async getCartTotal(@Param('id') userId: string): Promise<{ total: number }> {
    const total = await this.cartService.getCartTotal(userId);
    return {
      total: total,
    };
  }
}

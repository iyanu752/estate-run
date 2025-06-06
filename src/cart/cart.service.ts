import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Model, Types } from 'mongoose';
import { Product } from 'src/products/productschema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private cartModel: Model<Cart>,
  ) {}

  async getCartByUserId(userId: string): Promise<Cart> {
    try {
      const cart = await this.cartModel
        .findOne({ userId })
        .populate('items.productId');
      if (!cart) {
        throw new NotFoundException('Cart not found for this user');
      }
      return cart;
    } catch (error) {
      throw new InternalServerErrorException('failed to get cart:', error);
    }
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<{ cart: Cart; message: string }> {
    try {
      let cartItem = await this.cartModel.findOne({ userId });
      if (!cartItem) {
        cartItem = new this.cartModel({ userId, items: [] });
      }

      const existingProductIndex = cartItem.items.findIndex(
        (p) => p.productId.toString() === productId,
      );

      if (existingProductIndex > -1) {
        cartItem.items[existingProductIndex].quantity += quantity;
      } else {
        cartItem.items.push({
          productId: new Types.ObjectId(productId),
          quantity,
        });
      }

      cartItem = await cartItem.save();
      return { cart: cartItem, message: 'Product added to cart successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to add to cart: ', error);
    }
  }

  async updateCartItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<{ cart: Cart; message: string }> {
    try {
      const cartItem = await this.cartModel.findOne({
        userId: new Types.ObjectId(userId),
        'items.productId': new Types.ObjectId(productId),
      });
      if (!cartItem) {
        throw new NotFoundException('Cart not found for this user');
      }
      const itemIndex = cartItem.items.findIndex(
        (item) => item.productId.toString() === productId,
      );
      if (itemIndex === -1) {
        throw new NotFoundException('Item not found in cart');
      }
      if (quantity <= 0) {
        cartItem.items.splice(itemIndex, 1);
      } else {
        cartItem.items[itemIndex].quantity = quantity;
      }
      const updatedCart = await cartItem.save();
      return { cart: updatedCart, message: 'Cart item updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update cart item',
        error,
      );
    }
  }

  async removeFromCart(
    userId: string,
    productId: string,
  ): Promise<{ cart: Cart; message: string }> {
    try {
      const cartItem = await this.cartModel.findOne({
        userId: new Types.ObjectId(userId),
        'items.productId': new Types.ObjectId(productId),
      });
      if (!cartItem) {
        throw new NotFoundException('Cart not found for this user');
      }
      const itemIndex = cartItem.items.findIndex(
        (item) => item.productId.toString() === productId,
      );
      if (itemIndex === -1) {
        throw new NotFoundException('Item not found in cart');
      }
      cartItem.items.splice(itemIndex, 1);
      const updatedCart = await cartItem.save();
      return {
        cart: updatedCart,
        message: 'Item removed from cart successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to remove item from cart',
        error,
      );
    }
  }

  async clearCart(userId: string): Promise<{ cart: Cart; message: string }> {
    try {
      const cartItem = await this.cartModel.findOneAndDelete({ userId });
      if (!cartItem) {
        throw new NotFoundException('Cart not found for this user');
      }
      return { cart: cartItem, message: 'Cart cleared successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to clear cart', error);
    }
  }

  async getCartCount(userId: string): Promise<{ count: number }> {
    try {
      const cartItem = await this.cartModel.findOne({ userId });
      if (!cartItem) {
        return { count: 0 };
      }
      return {
        count: cartItem.items.reduce((count, item) => count + item.quantity, 0),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get cart count', error);
    }
  }

  async getCartTotal(userId: string): Promise<{ total: number }> {
    try {
      const cart = await this.cartModel
        .findOne({ userId })
        .populate('items.productId'); // populates product details

      if (!cart) {
        throw new NotFoundException('Cart not found for this user');
      }

      const total = cart.items.reduce((sum, item) => {
        const product = item.productId as unknown as Product;
        if (!product || !item.quantity) {
          return sum;
        }
        return sum + product.price * item.quantity;
      }, 0);

      return { total };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get cart total', error);
    }
  }
}

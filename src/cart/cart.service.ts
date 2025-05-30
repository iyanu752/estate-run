import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Model, Types } from 'mongoose';
import { Product } from 'src/products/product.schema';

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
        .populate('products.productId', 'name price image')
        .exec();
      if (!cart) {
        throw new NotFoundException(' Cart not found for this user ');
      }
      return cart;
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to retrieve cart', error);
    }
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    try {
      let cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        cart = new this.cartModel({ userId, items: [] });
      }
      const existingProductIndex = cart.items.findIndex(
        (p) => p.productId.toString() === productId,
      );
      if (existingProductIndex > -1) {
        cart.items[existingProductIndex].quantity += quantity;
      } else {
        cart.items.push({
          productId: new Types.ObjectId(productId),
          quantity,
        });
      }
      cart = await cart.save();
      return cart;
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to add to cart', error);
    }
  }

  async updateCartItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    try {
      const cart = await this.cartModel.findOne({
        userId: new Types.ObjectId(userId),
        'items.productId': new Types.ObjectId(productId),
      });
      if (!cart) {
        throw new NotFoundException('Cart not found for this user');
      }
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );
      if (itemIndex === -1) {
        throw new NotFoundException('Item not found in cart');
      }
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update cart item',
        error,
      );
    }
  }

  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    try {
      const cart = await this.cartModel.findOne({
        userId: new Types.ObjectId(userId),
        'items.productId': new Types.ObjectId(productId),
      });
      if (!cart) {
        throw new NotFoundException('Cart not found for this user');
      }
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );
      if (itemIndex === -1) {
        throw new NotFoundException('Item not found in cart');
      }
      cart.items.splice(itemIndex, 1);
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to remove item from cart',
        error,
      );
    }
  }

  async clearCart(userId: string): Promise<Cart> {
    try {
      const cart = await this.cartModel.findOneAndDelete({ userId });
      if (!cart) {
        throw new NotFoundException('Cart not found for this user');
      }
      return cart;
    } catch (error) {
      throw new InternalServerErrorException('Failed to clear cart', error);
    }
  }

  async getCartCount(userId: string): Promise<number> {
    try {
      const cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        return 0;
      }
      return cart.items.reduce((count, item) => count + item.quantity, 0);
    } catch (error) {
      throw new InternalServerErrorException('Failed to get cart count', error);
    }
  }

  async getCartTotal(userId: string): Promise<number> {
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

      return total;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get cart total', error);
    }
  }
}

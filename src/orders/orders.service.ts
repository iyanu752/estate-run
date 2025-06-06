import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Orders } from './orderschema';
import { CreateOrderDto } from './dto/orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name)
    private orderModel: Model<Orders>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Orders> {
    const newOrder = new this.orderModel(createOrderDto);
    return await newOrder.save();
  }

  async getAllOrders(): Promise<Orders[]> {
    const orders = await this.orderModel
      .find()
      .populate('userId')
      .populate('items.productId');
    return orders;
  }

  async getOrderById(orderId: string): Promise<Orders> {
    const order = await this.orderModel
      .findById(orderId)
      .populate('userId')
      .populate('items.productId')
      .exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Orders> {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = status;
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }
    return await order.save();
  }

  async deleteOrder(orderId: string): Promise<void> {
    const order = await this.orderModel.findByIdAndDelete(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return;
  }

  async getOrdersByUserId(userId: string): Promise<Orders[]> {
    const orders = await this.orderModel
      .find({ userId })
      .populate('items.productId')
      .exec();
    if (!orders || orders.length === 0) {
      throw new NotFoundException('No orders found for this user');
    }
    return orders;
  }

  async getOrderCountByUserId(userId: string): Promise<number> {
    const count = await this.orderModel.countDocuments({ userId });
    if (count === 0) {
      throw new NotFoundException('No orders found for this user');
    }
    return count;
  }

  async getTotalAmountByUserId(userId: string): Promise<number> {
    const orders = await this.orderModel.find({ userId });
    if (!orders || orders.length === 0) {
      throw new NotFoundException('No orders found for this user');
    }
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  }

  async getOrderCount(): Promise<number> {
    const count = await this.orderModel.countDocuments();
    if (count === 0) {
      throw new NotFoundException('No orders found');
    }
    return count;
  }
}

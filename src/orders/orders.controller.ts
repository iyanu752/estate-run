import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/orders.dto';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Post('/createOrder')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderDto);
  }

  @Get('/')
  async getAllOrders() {
    return await this.orderService.getAllOrders();
  }

  @Get('/user/:userId')
  async getOrdersByUserId(@Param('userId') userId: string) {
    return await this.orderService.getOrderCountByUserId(userId);
  }

  @Get('/count/:userId')
  async getOrderCountByUserId(@Param('userId') userId: string) {
    return await this.orderService.getOrderCountByUserId(userId);
  }

  @Get('/total/:userId')
  async getTotalAmountByUserId(@Param('userId') userId: string) {
    return await this.orderService.getTotalAmountByUserId(userId);
  }

  @Get('/totalOrders')
  async getTotalOrders() {
    return await this.orderService.getOrderCount();
  }

  @Get(':id')
  async getOrdersById(@Param('id') orderId: string) {
    return await this.orderService.getOrderById(orderId);
  }

  @Put(':id/:status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Param('status') status: string,
  ) {
    return await this.orderService.updateOrderStatus(orderId, status);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') orderId: string) {
    return await this.orderService.deleteOrder(orderId);
  }
}

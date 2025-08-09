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
import { CreateOrderDto, VerifyPaymentDto } from './dto/orders.dto';
// import { VerifyOrderDto } from 'src/verification/dto/verify-order.dto';
@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Post('createOrder')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderDto);
  }

  @Post('/verify-payment')
  async verifyPaymentAndCreateOrder(
    @Body() verifyPaymentDto: VerifyPaymentDto,
  ) {
    return await this.orderService.verifyPaymentAndCreateOrder(
      verifyPaymentDto,
    );
  }

  @Post('/create-pending')
  async createPendingOrder(@Body() orderData: any) {
    return await this.orderService.createPendingOrder(orderData);
  }

  @Post('/verify/:orderId')
  async verifyOrderCode(
    @Param('orderId') orderId: string,
    @Body('code') code: string,
  ) {
    return this.orderService.verifyOrderCode(orderId, code);
  }

  @Put('/payment-status/:orderId')
  async updatePaymentStatus(
    @Param('orderId') orderId: string,
    @Body()
    updateData: { paymentReference: string; status: 'success' | 'failed' },
  ) {
    return await this.orderService.updatePaymentStatus(
      orderId,
      updateData.paymentReference,
      updateData.status,
    );
  }

  @Get('/')
  async getAllOrders() {
    return await this.orderService.getAllOrders();
  }

  @Get('history/:userId')
  async getHistory(@Param('userId') userId: string) {
    return this.orderService.getOrderHistoryByUser(userId);
  }

  @Get('/vendor/:vendorId')
  async getOrdersByVendorId(@Param('vendorId') vendorId: string) {
    return await this.orderService.getOrdersForVendor(vendorId);
  }

  @Get('/user/:userId')
  async getOrdersByUserId(@Param('userId') userId: string) {
    return await this.orderService.getOrdersByUserId(userId);
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

  @Get('/order/:orderId')
  async getOrderByOrderId(@Param('orderId') orderId: string) {
    return await this.orderService.getOrderByOrderId(orderId);
  }

  @Get(':id')
  async getOrdersById(@Param('id') orderId: string) {
    return await this.orderService.getOrderById(orderId);
  }

  @Put('/updateStatus/:id/:status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Param('status') status: string,
  ) {
    return await this.orderService.updateOrderStatus(orderId, status);
  }

  @Post('/assignToRider/:orderId/:id')
  async assignRiderToOrder(
    @Param('orderId') orderId: string,
    @Param('id') riderId: string,
  ) {
    const updatedOrder = await this.orderService.assignRiderToOrder(
      orderId,
      riderId,
    );
    return {
      success: true,
      message: 'Rider successfully assigned to order',
      order: updatedOrder,
    };
  }

  @Delete(':id')
  async deleteOrder(@Param('id') orderId: string) {
    return await this.orderService.deleteOrder(orderId);
  }
}

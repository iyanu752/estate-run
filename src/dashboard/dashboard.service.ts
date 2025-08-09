import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Orders } from 'src/orders/orderschema';
import { User } from 'src/users/userschema';
import { Product } from 'src/products/productschema';
import { SuperMarket } from 'src/supermarket/supermarketschema';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';
@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Orders.name) private orderModel: Model<Orders>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(SuperMarket.name) private superMarketModel: Model<SuperMarket>,
  ) {}

  async getVendorDashboard(supermarketId: string, range: string) {
    const dateFilter = this.getDateRange(range);

    const orders = await this.orderModel.find({
      'items.supermarket': supermarketId,
      ...(dateFilter && { createdAt: dateFilter }),
    });

    const products = await this.productModel.find({
      supermarket: supermarketId,
    });

    const Orders = orders.length;
    const Revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrders = orders.filter((o) => o.status !== 'delivered').length;
    const productsCount = products.length;

    const averageOrderValue = Orders > 0 ? Revenue / Orders : 0;

    return {
      Orders,
      Revenue,
      'Pending Orders': pendingOrders,
      averageOrderValue,
      productsCount,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAdminDashboard(adminId: string) {
    const totalUsers = await this.userModel.countDocuments({
      userType: 'user',
    });

    const totalVendors = await this.userModel.countDocuments({
      userType: 'vendor',
    });

    const totalRiders = await this.userModel.countDocuments({
      userType: 'rider',
    });
    const allUsersCount = await this.userModel.countDocuments({
      userType: { $in: ['user', 'vendor', 'rider'] },
    });
    return {
      totalUsers,
      totalVendors,
      totalRiders,
      allUsersCount,
    };
  }

  async getAllUsers() {
    return this.userModel.find(
      {},
      'firstName lastName address bankName bankAccountNumber bankAccountName estate phone email userType createdAt',
    );
  }

  async getUsersByType(userType: string) {
    if (userType === 'vendor') {
      const users = await this.userModel.find(
        { userType },
        'firstName lastName email address status bankName bankAccountNumber bankAccountName estate  phone userType createdAt supermarket',
      );

      const usersWithDetails = await Promise.all(
        users.map(async (user) => {
          const productsCount = await this.productModel.countDocuments({
            supermarket: user.supermarket || user._id,
          });
          let supermarketInfo: {
            name?: string;
            approved?: boolean;
            isOpen?: boolean;
            openTime?: string;
            closeTime?: string;
            description?: string;
          } | null = null;
          if (user.supermarket) {
            supermarketInfo = await this.superMarketModel.findById(
              user.supermarket,
              'name approved status openTime closeTime description isOpen',
            );
          }

          return {
            ...user.toObject(),
            productsCount,
            supermarketName: supermarketInfo?.name || 'Unknown Supermarket',
            openTime: supermarketInfo?.openTime || '8:00 AM',
            closeTime: supermarketInfo?.closeTime || '8:00 Pm',
            description: supermarketInfo?.description || 'No description',
            supermarketApproved: supermarketInfo?.approved || false,
            isOpen: supermarketInfo?.isOpen || false,
          };
        }),
      );
      return usersWithDetails;
    }
    const users = await this.userModel.find(
      { userType },
      'firstName lastName address estate status bankName bankAccountNumber bankAccountName email phone userType createdAt supermarket',
    );
    if (userType === 'rider') {
      const usersWithDetails = await Promise.all(
        users.map(async (user) => {
          const totalDeliveries = await this.orderModel.countDocuments({
            assignedRider: user._id,
            status: 'delivered',
          });

          const assignedOrdersCount = await this.orderModel.countDocuments({
            assignedRider: user._id,
          });

          return {
            ...user.toObject(),
            totalDeliveries,
            assignedOrdersCount,
          };
        }),
      );
      return usersWithDetails;
    }

    // For regular users, return as is
    return users;
  }

  async getRiderDashboard(riderId: string) {
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();

    const totalDeliveries = await this.orderModel.countDocuments({
      assignedRider: riderId,
      status: 'delivered',
    });

    const todaysDeliveries = await this.orderModel.countDocuments({
      assignedRider: riderId,
      status: 'delivered',
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    const pendingDeliveries = await this.orderModel.countDocuments({
      assignedRider: riderId,
      status: { $ne: 'delivered' },
    });

    // const rating = await this.getRiderRating(riderId);

    return {
      totalDeliveries,
      todaysDeliveries,
      pendingDeliveries,
    };
  }

  private getDateRange(range: string): { $gte: Date; $lte: Date } | null {
    const now = dayjs();
    switch (range) {
      case 'today':
        return {
          $gte: now.startOf('day').toDate(),
          $lte: now.endOf('day').toDate(),
        };
      case 'week':
        return {
          $gte: now.startOf('week').toDate(),
          $lte: now.endOf('week').toDate(),
        };
      case 'month':
        return {
          $gte: now.startOf('month').toDate(),
          $lte: now.endOf('month').toDate(),
        };
      case 'year':
        return {
          $gte: now.startOf('year').toDate(),
          $lte: now.endOf('year').toDate(),
        };
      case 'all':
      default:
        return null;
    }
  }
}

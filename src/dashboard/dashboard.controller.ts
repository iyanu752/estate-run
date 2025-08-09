import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getVendorStats(
    @Query('supermarketId') supermarketId: string,
    @Query('range') range: 'today' | 'week' | 'month' | 'year' | 'all' = 'all',
  ) {
    return this.dashboardService.getVendorDashboard(supermarketId, range);
  }
  @Get('rider/:riderId')
  async getRiderDashboard(@Query('riderId') riderId: string) {
    return await this.dashboardService.getRiderDashboard(riderId);
  }

  @Get('allUsers')
  async getAllUsers() {
    return this.dashboardService.getAllUsers();
  }

  @Get('vendors')
  async getVendors() {
    return this.dashboardService.getUsersByType('vendor');
  }

  @Get('riders')
  async getRiders() {
    return this.dashboardService.getUsersByType('rider');
  }

  @Get('users')
  async getUsers() {
    return this.dashboardService.getUsersByType('user');
  }
  @Get('admin/:adminId')
  async getAdminDashboard(@Query('adminId') adminId: string) {
    return await this.dashboardService.getAdminDashboard(adminId);
  }
}

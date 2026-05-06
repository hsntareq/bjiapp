import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SeedKhilgaonService } from './common/services/seed-khilgaon.service';
import { SeedDataService } from './common/services/seed-data.service';
import { SeedOmsUsersService } from './common/services/seed-oms-users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly seedDataService: SeedDataService,
    private readonly seedKhilgaonService: SeedKhilgaonService,
    private readonly seedOmsUsersService: SeedOmsUsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('seed')
  async seed() {
    try {
      await this.seedDataService.seed();
      return { success: true, message: 'Database seeded successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('seed-khilgaon')
  async seedKhilgaon() {
    try {
      await this.seedKhilgaonService.seed();
      return { success: true, message: 'Khilgaon hierarchy seeded successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('seed-oms')
  async seedOms() {
    try {
      await this.seedOmsUsersService.seed();
      return { success: true, message: 'OMS users seeded successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

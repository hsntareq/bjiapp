import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SeedDataService } from './common/services/seed-data.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly seedDataService: SeedDataService,
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
}

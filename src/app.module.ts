import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { DistributorsModule } from './distributors/distributors.module';
import { ConsumersModule } from './consumers/consumers.module';
import { ProductsModule } from './products/products.module';
import { TargetsModule } from './targets/targets.module';
import { RewardsModule } from './rewards/rewards.module';
import { PointsModule } from './points/points.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DatabaseModule,
    DistributorsModule,
    ConsumersModule,
    ProductsModule,
    TargetsModule,
    RewardsModule,
    PointsModule,
    SalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

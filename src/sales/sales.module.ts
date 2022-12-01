import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { ProductsModule } from '../products/products.module';
import { DistributorsModule } from '../distributors/distributors.module';
import { ConsumersModule } from '../consumers/consumers.module';
import { DistributorsService } from '../distributors/distributors.service';
import { ConsumersService } from '../consumers/consumers.service';
import { salesProvider } from './sales.provider';
import { distributorsProvider } from '../distributors/distributors.provider';
import { consumersProvider } from '../consumers/consumers.provider';
import { ProductsService } from '../products/products.service';
import { productsProvider } from '../products/products.provider';
import { RewardsModule } from '../rewards/rewards.module';
import { RewardsService } from '../rewards/rewards.service';
import { rewardsProvider } from '../rewards/rewards.provider';
import { targetProvider } from '../targets/targets.provider';
import { pointsProvider } from '../points/points.provider';
import { PointsService } from '../points/points.service';
import { PointsModule } from '../points/points.module';

@Module({
  imports: [
    ProductsModule,
    DistributorsModule,
    ConsumersModule,
    RewardsModule,
    PointsModule,
  ],
  controllers: [SalesController],
  providers: [
    SalesService,
    DistributorsService,
    ConsumersService,
    ProductsService,
    RewardsService,
    PointsService,
    ...salesProvider,
    ...distributorsProvider,
    ...productsProvider,
    ...consumersProvider,
    ...rewardsProvider,
    ...targetProvider,
    ...pointsProvider,
  ],
})
export class SalesModule {}

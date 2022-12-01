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

@Module({
  imports: [ProductsModule, DistributorsModule, ConsumersModule],
  controllers: [SalesController],
  providers: [
    SalesService,
    DistributorsService,
    ConsumersService,
    ProductsService,
    ...salesProvider,
    ...distributorsProvider,
    ...productsProvider,
    ...consumersProvider,
  ],
})
export class SalesModule {}

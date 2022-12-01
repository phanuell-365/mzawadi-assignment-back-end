import { Module } from '@nestjs/common';
import { TargetsService } from './targets.service';
import { TargetsController } from './targets.controller';
import { targetProvider } from './targets.provider';
import { productsProvider } from '../products/products.provider';
import { ProductsModule } from '../products/products.module';
import { ProductsService } from '../products/products.service';
import { DistributorsModule } from '../distributors/distributors.module';
import { DistributorsService } from '../distributors/distributors.service';
import { distributorsProvider } from '../distributors/distributors.provider';

@Module({
  imports: [ProductsModule, DistributorsModule],
  controllers: [TargetsController],
  providers: [
    TargetsService,
    ProductsService,
    DistributorsService,
    ...targetProvider,
    ...productsProvider,
    ...distributorsProvider,
  ],
})
export class TargetsModule {}

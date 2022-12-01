import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { productsProvider } from './products.provider';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ...productsProvider],
})
export class ProductsModule {}

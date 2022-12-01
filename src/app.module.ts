import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { DistributorsModule } from './distributors/distributors.module';
import { ConsumersModule } from './consumers/consumers.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DatabaseModule,
    DistributorsModule,
    ConsumersModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

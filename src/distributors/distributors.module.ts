import { Module } from '@nestjs/common';
import { DistributorsService } from './distributors.service';
import { DistributorsController } from './distributors.controller';

@Module({
  controllers: [DistributorsController],
  providers: [DistributorsService],
})
export class DistributorsModule {}

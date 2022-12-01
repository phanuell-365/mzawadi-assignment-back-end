import { Module } from '@nestjs/common';
import { DistributorsService } from './distributors.service';
import { DistributorsController } from './distributors.controller';
import { distributorsProvider } from './distributors.provider';

@Module({
  controllers: [DistributorsController],
  providers: [DistributorsService, ...distributorsProvider],
})
export class DistributorsModule {}

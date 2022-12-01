import { Module } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { salesProvider } from '../sales/sales.provider';
import { rewardsProvider } from './rewards.provider';
import { targetProvider } from '../targets/targets.provider';
import { distributorsProvider } from '../distributors/distributors.provider';

@Module({
  controllers: [RewardsController],
  providers: [
    RewardsService,
    ...salesProvider,
    ...rewardsProvider,
    ...targetProvider,
    ...distributorsProvider,
  ],
})
export class RewardsModule {}

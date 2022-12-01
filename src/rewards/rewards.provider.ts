import { REWARDS_REPOSITORY } from './const';
import { Reward } from './entities';

export const rewardsProvider = [
  {
    provide: REWARDS_REPOSITORY,
    useValue: Reward,
  },
];

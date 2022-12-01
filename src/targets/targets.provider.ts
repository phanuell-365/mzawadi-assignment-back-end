import { TARGETS_REPOSITORY } from './const';
import { Target } from './entities';

export const targetProvider = [
  {
    provide: TARGETS_REPOSITORY,
    useValue: Target,
  },
];

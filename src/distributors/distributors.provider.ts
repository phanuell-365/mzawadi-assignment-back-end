import { DISTRIBUTORS_REPOSITORY } from './const';
import { Distributor } from './entities';

export const distributorsProvider = [
  {
    provide: DISTRIBUTORS_REPOSITORY,
    useValue: Distributor,
  },
];

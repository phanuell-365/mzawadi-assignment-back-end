import { CONSUMERS_REPOSITORY } from './const';
import { Consumer } from './entities';

export const consumersProvider = [
  {
    provide: CONSUMERS_REPOSITORY,
    useValue: Consumer,
  },
];

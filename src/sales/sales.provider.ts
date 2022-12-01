import { SALES_REPOSITORY } from './const';
import { Sale } from './entities';

export const salesProvider = [
  {
    provide: SALES_REPOSITORY,
    useValue: Sale,
  },
];

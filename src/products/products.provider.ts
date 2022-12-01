import { PRODUCT_REPOSITORY } from './const';
import { Product } from './entities';

export const productsProvider = [
  {
    provide: PRODUCT_REPOSITORY,
    useValue: Product,
  },
];

import { POINTS_REPOSITORY } from './const';
import { Point } from './entities/point.entity';

export const pointsProvider = [
  {
    provide: POINTS_REPOSITORY,
    useValue: Point,
  },
];

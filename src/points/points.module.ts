import { Module } from '@nestjs/common';
import { PointsService } from './points.service';
import { PointsController } from './points.controller';
import { pointsProvider } from './points.provider';
import { consumersProvider } from '../consumers/consumers.provider';

@Module({
  controllers: [PointsController],
  providers: [PointsService, ...pointsProvider, ...consumersProvider],
})
export class PointsModule {}

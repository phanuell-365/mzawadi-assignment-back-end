import { Module } from '@nestjs/common';
import { ConsumersService } from './consumers.service';
import { ConsumersController } from './consumers.controller';
import { consumersProvider } from './consumers.provider';

@Module({
  controllers: [ConsumersController],
  providers: [ConsumersService, ...consumersProvider],
})
export class ConsumersModule {}

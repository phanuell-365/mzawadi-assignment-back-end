import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { PointsService } from './points.service';
import { JwtAuthGuard } from '../auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  // @Post()
  // create(@Body() createPointDto: CreatePointDto) {
  //   return this.pointsService.createPoints(createPointDto);
  // }

  @Get()
  findAll() {
    return this.pointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pointsService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePointDto: UpdatePointDto) {
  //   return this.pointsService.update(id, updatePointDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointsService.remove(id);
  }
}

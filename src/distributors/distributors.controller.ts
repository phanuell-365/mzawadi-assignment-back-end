import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DistributorsService } from './distributors.service';
import { CreateDistributorDto, UpdateDistributorDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('distributors')
export class DistributorsController {
  constructor(private readonly distributorsService: DistributorsService) {}

  @Post()
  create(@Body() createDistributorDto: CreateDistributorDto) {
    return this.distributorsService.create(createDistributorDto);
  }

  @Get()
  findAll() {
    return this.distributorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.distributorsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDistributorDto: UpdateDistributorDto,
  ) {
    return this.distributorsService.update(id, updateDistributorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.distributorsService.remove(id);
  }
}

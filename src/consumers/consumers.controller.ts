import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ConsumersService } from './consumers.service';
import { CreateConsumerDto, UpdateConsumerDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('consumers')
export class ConsumersController {
  constructor(private readonly consumersService: ConsumersService) {}

  @Post()
  create(@Body() createConsumerDto: CreateConsumerDto) {
    return this.consumersService.create(createConsumerDto);
  }

  @Get()
  findAll() {
    return this.consumersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consumersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConsumerDto: UpdateConsumerDto,
  ) {
    return this.consumersService.update(id, updateConsumerDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consumersService.remove(id);
  }
}

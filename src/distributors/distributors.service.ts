import { Injectable } from '@nestjs/common';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { UpdateDistributorDto } from './dto/update-distributor.dto';

@Injectable()
export class DistributorsService {
  create(createDistributorDto: CreateDistributorDto) {
    return 'This action adds a new distributor';
  }

  findAll() {
    return `This action returns all distributors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} distributor`;
  }

  update(id: number, updateDistributorDto: UpdateDistributorDto) {
    return `This action updates a #${id} distributor`;
  }

  remove(id: number) {
    return `This action removes a #${id} distributor`;
  }
}

import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { CreateDistributorDto, UpdateDistributorDto } from './dto';
import { DISTRIBUTORS_NOT_FOUND, DISTRIBUTORS_REPOSITORY } from './const';
import { Distributor } from './entities';

@Injectable()
export class DistributorsService {
  constructor(
    @Inject(DISTRIBUTORS_REPOSITORY)
    private readonly distributorsRepository: typeof Distributor,
  ) {}

  async getDistributor(options: {
    distributorId?: string;
    name?: string;
    email?: string;
  }) {
    let distributor: Distributor;
    if (options.distributorId) {
      distributor = await this.distributorsRepository.findByPk(
        options.distributorId,
      );

      if (!distributor) return false;
    } else if (options.name) {
      distributor = await this.distributorsRepository.findOne({
        where: {
          name: options.name,
        },
      });

      if (!distributor) return false;
    } else if (options.email) {
      distributor = await this.distributorsRepository.findOne({
        where: {
          email: options.email,
        },
      });

      if (!distributor) return false;
    } else return false;

    return distributor;
  }

  async create(createDistributorDto: CreateDistributorDto) {
    // check if there is a distributor with the given name
    let distributor = await this.getDistributor({
      name: createDistributorDto.name,
    });

    // if there is, throw a new precondition failed exception
    // for there is an existing distributor with the given name
    if (distributor) {
      throw new PreconditionFailedException(
        'Distributor with the given name already exists',
      );
    }

    // check if there is a distributor with the given email
    distributor = await this.getDistributor({
      email: createDistributorDto.email,
    });

    // if there is, throw a new precondition failed exception
    // for there is an existing distributor with the given email
    if (distributor) {
      throw new PreconditionFailedException(
        'Distributor with the given email already exists',
      );
    }

    // else create the new distributor
    return await this.distributorsRepository.create({
      ...createDistributorDto,
    });
  }

  async findAll() {
    return await this.distributorsRepository.findAll();
  }

  async findOne(distributorId: string) {
    // get the distributor with the give id
    const distributor = await this.getDistributor({ distributorId });

    // check if the distributor with the given id exists
    if (distributor) return distributor;
    // else throw a not found exception, the distributor does not exist
    else throw new NotFoundException(DISTRIBUTORS_NOT_FOUND);
  }

  async update(
    distributorId: string,
    updateDistributorDto: UpdateDistributorDto,
  ) {
    // get the distributor with the give id
    const distributor = await this.getDistributor({ distributorId });

    // if the distributor does not exist, throw a new NotFoundException
    if (!distributor) throw new NotFoundException(DISTRIBUTORS_NOT_FOUND);

    // if the name is being updated
    if (updateDistributorDto.name) {
      // check if there is another distributor with the given name
      const anotherDistributor = await this.getDistributor({
        name: updateDistributorDto.name,
      });

      // if there exists a distributor, throw a new ConflictException error
      if (anotherDistributor && distributor.id !== anotherDistributor.id) {
        throw new ConflictException(
          'Distributor with the given name already exists',
        );
      }
      // else update the name
      else distributor.name = updateDistributorDto.name;
    }

    // if the email is being updated
    if (updateDistributorDto.email) {
      // check if there is another distributor with the given email
      const anotherDistributor = await this.getDistributor({
        email: updateDistributorDto.email,
      });

      // if there exists a distributor, throw a new ConflictException error
      if (anotherDistributor && distributor.id !== anotherDistributor.id) {
        throw new ConflictException(
          'Distributor with the given email already exists',
        );
      }
      // else update the email
      else distributor.email = updateDistributorDto.email;
    }

    if (updateDistributorDto.phone)
      // if the phone is given update the phone
      distributor.phone = updateDistributorDto.phone;

    // return the updated distributor
    return await distributor.save();
  }

  async remove(distributorId: string) {
    // get the distributor with the give id
    const distributor = await this.getDistributor({ distributorId });

    // if the distributor does not exist, throw a new NotFoundException
    if (!distributor) throw new NotFoundException(DISTRIBUTORS_NOT_FOUND);

    // else destroy the distributor and return
    return distributor.destroy();
  }
}

import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { CreateConsumerDto, UpdateConsumerDto } from './dto';
import { CONSUMER_NOT_FOUND, CONSUMERS_REPOSITORY } from './const';
import { Consumer } from './entities';

@Injectable()
export class ConsumersService {
  constructor(
    @Inject(CONSUMERS_REPOSITORY)
    private readonly consumersRepository: typeof Consumer,
  ) {}

  async getConsumer(options: {
    consumerId?: string;
    name?: string;
    email?: string;
  }) {
    let consumer: Consumer;
    if (options.consumerId) {
      consumer = await this.consumersRepository.findByPk(options.consumerId);

      if (!consumer) return false;
    } else if (options.name) {
      consumer = await this.consumersRepository.findOne({
        where: {
          name: options.name,
        },
      });

      if (!consumer) return false;
    } else if (options.email) {
      consumer = await this.consumersRepository.findOne({
        where: {
          email: options.email,
        },
      });

      if (!consumer) return false;
    } else return false;

    return consumer;
  }

  async create(createConsumerDto: CreateConsumerDto) {
    // check if there is a consumer with the given name
    let consumer = await this.getConsumer({ name: createConsumerDto.name });

    // if there is, throw a new precondition failed exception
    // for there is an existing consumer with the given name
    if (consumer) {
      throw new PreconditionFailedException(
        'Consumer with the given name already exists',
      );
    }

    // check if there is a consumer with the given email
    consumer = await this.getConsumer({ email: createConsumerDto.email });

    // if there is, throw a new precondition failed exception
    // for there is an existing consumer with the given email
    if (consumer) {
      throw new PreconditionFailedException(
        'Consumer with the given email already exists',
      );
    }

    // else create the new consumer
    return await this.consumersRepository.create({
      ...createConsumerDto,
    });
  }

  async findAll() {
    return await this.consumersRepository.findAll();
  }

  async findOne(consumerId: string) {
    // get the consumer with the give id
    const consumer = await this.getConsumer({ consumerId });

    // check if the consumer with the given id exists
    if (consumer) return consumer;
    // else throw a not found exception, the consumer does not exist
    else throw new NotFoundException(CONSUMER_NOT_FOUND);
  }

  async update(consumerId: string, updateConsumerDto: UpdateConsumerDto) {
    // get the consumer with the give id
    const consumer = await this.getConsumer({ consumerId });

    // if the consumer does not exist, throw a new NotFoundException
    if (!consumer) throw new NotFoundException(CONSUMER_NOT_FOUND);

    // if the name is being updated
    if (updateConsumerDto.name) {
      // check if there is another consumer with the given name
      const anotherConsumer = await this.getConsumer({
        name: updateConsumerDto.name,
      });

      // if there exists a consumer, throw a new ConflictException error
      if (anotherConsumer && consumer.id !== anotherConsumer.id) {
        throw new ConflictException(
          'Consumer with the given name already exists',
        );
      }
      // else update the name
      else consumer.name = updateConsumerDto.name;
    }

    // if the email is being updated
    if (updateConsumerDto.email) {
      // check if there is another consumer with the given email
      const anotherConsumer = await this.getConsumer({
        email: updateConsumerDto.email,
      });

      // if there exists a consumer, throw a new ConflictException error
      if (anotherConsumer && consumer.id !== anotherConsumer.id) {
        throw new ConflictException(
          'Consumer with the given email already exists',
        );
      }
      // else update the email
      else consumer.email = updateConsumerDto.email;
    }

    // else update the phone and return the updated consumer
    consumer.phone = updateConsumerDto.phone;

    return await consumer.save();
  }

  async remove(consumerId: string) {
    // get the consumer with the give id
    const consumer = await this.getConsumer({ consumerId });

    // if the consumer does not exist, throw a new NotFoundException
    if (!consumer) throw new NotFoundException(CONSUMER_NOT_FOUND);

    // else destroy the consumer and return
    return consumer.destroy();
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { CONSUMERS_REPOSITORY } from '../consumers/const';
import { Consumer } from '../consumers/entities';
import { POINT_NOT_FOUND, POINTS_REPOSITORY, POINTS_VALUE } from './const';
import { Point } from './entities';
import { Sale } from '../sales/entities';

@Injectable()
export class PointsService {
  constructor(
    @Inject(CONSUMERS_REPOSITORY)
    private readonly consumersRepository: typeof Consumer,
    @Inject(POINTS_REPOSITORY)
    private readonly pointsRepository: typeof Point,
  ) {}

  public async getPoint(options: { pointId?: string }) {
    let point: Point;

    if (options.pointId) {
      point = await this.pointsRepository.findByPk(options.pointId);

      if (!point) return false;
    }

    return point;
  }

  public async extendPointsToConsumer(sale: Sale) {
    const totalAmount = sale.totalAmount;

    const points = await this.calculateConsumerPoints(totalAmount);

    const valueOfPoints = await this.calculateValueOfConsumerPoints(points);

    await this.updateConsumerPoints(sale.ConsumerId, points, valueOfPoints);

    return await this.createPoints({
      points,
      valueOfPoints,
      SaleId: sale.id,
    });
  }

  async createPoints(createPointDto: CreatePointDto) {
    return await this.pointsRepository.create({
      ...createPointDto,
    });
  }

  async findAll() {
    return await this.pointsRepository.findAll();
  }

  async findOne(pointId: string) {
    const point = await this.getPoint({ pointId });

    if (!point) throw new NotFoundException(POINT_NOT_FOUND);

    return point;
  }

  async remove(pointId: string) {
    return await this.findOne(pointId);
  }

  private async calculateConsumerPoints(totalAmount: number) {
    // calculate the points and return them
    const percent = 1 / 100;

    return totalAmount * percent;
  }

  private async calculateValueOfConsumerPoints(consumerPoints: number) {
    return POINTS_VALUE * consumerPoints;
  }

  // update(id: number, updatePointDto: UpdatePointDto) {
  //   return `This action updates a #${id} point`;
  // }

  private async updateConsumerPoints(
    consumerId: string,
    points: number,
    valueOfPoints: number,
  ) {
    const consumer = await this.consumersRepository.findByPk(consumerId);

    consumer.points += points;
    consumer.valueOfPoints += valueOfPoints;

    return await consumer.save();
  }
}

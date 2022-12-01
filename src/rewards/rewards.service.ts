import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRewardDto } from './dto';
import { SALES_REPOSITORY } from '../sales/const';
import { Sale } from '../sales/entities';
import { REBATE_PERCENT, REWARD_NOT_FOUND, REWARDS_REPOSITORY } from './const';
import { Reward } from './entities';
import { TARGET_NOT_FOUND, TARGETS_REPOSITORY } from '../targets/const';
import { Target } from '../targets/entities';
import { Op } from 'sequelize';
import { DISTRIBUTORS_REPOSITORY } from '../distributors/const';
import { Distributor } from '../distributors/entities';

@Injectable()
export class RewardsService {
  constructor(
    @Inject(SALES_REPOSITORY) private readonly salesRepository: typeof Sale,
    @Inject(REWARDS_REPOSITORY)
    private readonly rewardsRepository: typeof Reward,
    @Inject(TARGETS_REPOSITORY)
    private readonly targetsRepository: typeof Target,
    @Inject(DISTRIBUTORS_REPOSITORY)
    private readonly distributorsRepository: typeof Distributor,
  ) {}

  async getReward(options: {
    rewardId?: string;
    distributorAndProductId?: {
      DistributorId: string;
      ProductId: string;
    };
  }) {
    let reward: Reward;

    if (options.rewardId) {
      reward = await this.rewardsRepository.findByPk(options.rewardId);

      if (!reward) return false;
    }

    return reward;
  }

  async countSalesByDistributorForProductY(distributorId: string, productId) {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);

    const NOW = new Date();

    const { rows: sales, count: numOfSales } =
      await this.salesRepository.findAndCountAll({
        where: {
          DistributorId: distributorId,
          ProductId: productId,
          soldAt: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
      });

    return {
      sales,
      numOfSales,
    };
  }

  async getSalesTarget(distributorId: string, productId: string) {
    const target = await this.targetsRepository.findOne({
      where: {
        DistributorId: distributorId,
        ProductId: productId,
      },
    });

    // if no target was found, throw a not found exception
    if (!target) throw new NotFoundException(TARGET_NOT_FOUND);

    return +target.salesTarget;
  }

  async getSalesTotalAmounts(sales: Sale[]) {
    return sales.map((value) => value.totalAmount);
  }

  async calculateTodayTotal(salesTotalAmounts: number[]) {
    return salesTotalAmounts.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
    );
  }

  async calculateRebateAmount(salesTarget: number) {
    const rebate = REBATE_PERCENT / 100;

    return +salesTarget * rebate;
  }

  async updateDistributorRebateAmount(
    rebateAmount: number,
    distributorId: string,
  ) {
    const distributor = await this.distributorsRepository.findByPk(
      distributorId,
    );

    distributor.rebateAmount += +rebateAmount;

    return await distributor.save();
  }

  async rewardDistributor(sale: Sale) {
    const distributorId = sale.DistributorId;
    const productId = sale.ProductId;

    // get the sales from 12 am till now
    const { sales } = await this.countSalesByDistributorForProductY(
      distributorId,
      productId,
    );

    // check if the sales given is part of the counted sales
    if (!sales.some((value) => value.id === sale.id)) {
      // if not found, then the sale is added into the array
      sales.push(sale);
    }

    const salesTarget = await this.getSalesTarget(
      sale.DistributorId,
      sale.ProductId,
    );

    const totalAmounts = await this.getSalesTotalAmounts(sales);

    const todayTotal = await this.calculateTodayTotal(totalAmounts);

    const rebateAmount = await this.calculateRebateAmount(salesTarget);

    await this.updateDistributorRebateAmount(rebateAmount, distributorId);

    // check if today'sTotal is greater than or equal to the salesTarget
    if (todayTotal >= salesTarget) {
      // if true, we issue the reward
      return await this.createReward({
        rebateAmount,
        salesTarget,
        DistributorId: distributorId,
        ProductId: productId,
      });
    }
    // if the sales target is not yet reached, return
    else return;
  }

  async createReward(createRewardDto: CreateRewardDto) {
    console.error({ ...createRewardDto });
    return await this.rewardsRepository.create({
      ...createRewardDto,
    });
  }

  async findAll() {
    return await this.rewardsRepository.findAll();
  }

  async findOne(rewardId: string) {
    const reward = await this.getReward({ rewardId });

    if (!reward) throw new NotFoundException(REWARD_NOT_FOUND);

    return reward;
  }

  // update(id: number, updateRewardDto: UpdateRewardDto) {
  //   return `This action updates a #${id} reward`;
  // }

  async remove(rewardId: string) {
    return await this.findOne(rewardId);
  }
}

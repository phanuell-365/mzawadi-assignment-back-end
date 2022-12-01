import { Inject, Injectable } from '@nestjs/common';
import { CreateRewardDto, UpdateRewardDto } from './dto';
import { SALES_REPOSITORY } from '../sales/const';
import { Sale } from '../sales/entities';
import { REWARDS_REPOSITORY } from './const';
import { Reward } from './entities';
import { TARGETS_REPOSITORY } from '../targets/const';
import { Target } from '../targets/entities';

@Injectable()
export class RewardsService {
  constructor(
    @Inject(SALES_REPOSITORY) private readonly salesRepository: typeof Sale,
    @Inject(REWARDS_REPOSITORY)
    private readonly rewardsRepository: typeof Reward,
    @Inject(TARGETS_REPOSITORY)
    private readonly targetsRepository: typeof Target,
  ) {}

  async getReward(options: {
    rewardId?: string;
    distributorAndProductId: {
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
    const { rows: sales, count: numOfSales } =
      await this.salesRepository.findAndCountAll({
        where: {
          DistributorId: distributorId,
          ProductId: productId,
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

    return +target.salesTarget;
  }

  //
  // async getCurrentNumberOfSales() {}
  //
  // async isTargetReached() {}

  async rewardDistributor(sale: Sale) {
    const distributorId = sale.DistributorId;
    const productId = sale.ProductId;

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
  }

  createReward(createRewardDto: CreateRewardDto) {
    const distributionId = createRewardDto.DistributionId;
  }

  findAll() {
    return `This action returns all rewards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reward`;
  }

  update(id: number, updateRewardDto: UpdateRewardDto) {
    return `This action updates a #${id} reward`;
  }

  remove(id: number) {
    return `This action removes a #${id} reward`;
  }
}

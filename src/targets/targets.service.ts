import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTargetDto, UpdateTargetDto } from './dto';
import { TARGET_NOT_FOUND, TARGETS_REPOSITORY } from './const';
import { Target } from './entities';
import { DistributorsService } from '../distributors/distributors.service';
import { DISTRIBUTORS_NOT_FOUND } from '../distributors/const';
import { ProductsService } from '../products/products.service';
import { PRODUCT_NOT_FOUND } from '../products/const';

@Injectable()
export class TargetsService {
  constructor(
    @Inject(TARGETS_REPOSITORY)
    private readonly targetsRepository: typeof Target,
    private readonly distributorsService: DistributorsService,
    private readonly productsService: ProductsService,
  ) {}

  // helper functions for th targetsService

  async getTarget(options: { targetId?: string }) {
    let target: Target;

    if (options.targetId) {
      target = await this.targetsRepository.findByPk(options.targetId);

      if (!target) return false;
    } else return false;

    return target;
  }

  // services for the targetsController

  async create(createTargetDto: CreateTargetDto) {
    // get the distributor by the given id from the createTargetDto
    const distributor = await this.distributorsService.getDistributor({
      distributorId: createTargetDto.DistributorId,
    });

    // if the distributor is not found, throw new NotFoundException exception.
    if (!distributor) {
      throw new NotFoundException(DISTRIBUTORS_NOT_FOUND);
    }

    // get the product by the given id from the createTargetDto
    const product = await this.productsService.getProduct({
      productId: createTargetDto.ProductId,
    });

    // if the product is not found, throw new NotFoundException exception.
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }

    // else create the new target and return it

    return await this.targetsRepository.create({
      ...createTargetDto,
    });
  }

  async findAll() {
    return await this.targetsRepository.findAll();
  }

  async findOne(targetId: string) {
    // get the target with the give id
    const target = await this.getTarget({ targetId });

    // check if the target with the given id exists
    if (target) return target;
    // else throw a not found exception, the target does not exist
    else throw new NotFoundException(TARGET_NOT_FOUND);
  }

  async update(targetId: string, updateTargetDto: UpdateTargetDto) {
    // get the target with the give id
    const target = await this.getTarget({ targetId });

    // check if the target with the given id exists
    if (!target) {
      // throw a not found exception if the target does not exist
      throw new NotFoundException(TARGET_NOT_FOUND);
    }

    // if the distributor id is provided
    if (updateTargetDto.DistributorId) {
      // get the distributor by the given id from the createTargetDto
      const distributor = await this.distributorsService.getDistributor({
        distributorId: updateTargetDto.DistributorId,
      });

      // if the distributor is not found, throw new NotFoundException exception.
      if (!distributor) {
        throw new NotFoundException(DISTRIBUTORS_NOT_FOUND);
      }

      // else update the target
      target.DistributorId = updateTargetDto.DistributorId;
    }

    if (updateTargetDto.ProductId) {
      // get the product by the given id from the createTargetDto
      const product = await this.productsService.getProduct({
        productId: updateTargetDto.ProductId,
      });

      // if the product is not found, throw new NotFoundException exception.
      if (!product) {
        throw new NotFoundException(PRODUCT_NOT_FOUND);
      }

      // else update the target
      target.ProductId = updateTargetDto.ProductId;
    }

    // update the sales target if it is in the updateTarget dto
    if (updateTargetDto.salesTarget) {
      target.salesTarget = updateTargetDto.salesTarget;
    }

    return await target.save();
  }

  async remove(targetId: string) {
    // get the target with the give id
    const target = await this.getTarget({ targetId });

    // if the target does not exist, throw a new NotFoundException
    if (!target) throw new NotFoundException(TARGET_NOT_FOUND);

    // else destroy the target and return
    return target.destroy();
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto, UpdateSaleDto } from './dto';
import { SALE_NOT_FOUND, SALES_REPOSITORY } from './const';
import { Sale } from './entities';
import { DistributorsService } from '../distributors/distributors.service';
import { ProductsService } from '../products/products.service';
import { PRODUCT_NOT_FOUND } from '../products/const';
import { DISTRIBUTORS_NOT_FOUND } from '../distributors/const';
import { ConsumersService } from '../consumers/consumers.service';
import { CONSUMER_NOT_FOUND } from '../consumers/const';
import { Product } from '../products/entities';
import { RewardsService } from '../rewards/rewards.service';
import { PointsService } from '../points/points.service';

@Injectable()
export class SalesService {
  constructor(
    @Inject(SALES_REPOSITORY) private readonly salesRepository: typeof Sale,
    private readonly distributorsService: DistributorsService,
    private readonly productsService: ProductsService,
    private readonly consumersService: ConsumersService,
    private readonly rewardsService: RewardsService,
    private readonly pointsService: PointsService,
  ) {}

  async getSale(options: { saleId?: string }) {
    let sale: Sale;

    if (options.saleId) {
      sale = await this.salesRepository.findByPk(options.saleId);

      if (!sale) return false;
    } else return false;

    return sale;
  }

  async create(createSaleDto: CreateSaleDto) {
    // get the distributor by the given id from the createSaleDto
    const distributor = await this.distributorsService.getDistributor({
      distributorId: createSaleDto.DistributorId,
    });

    // if the distributor is not found, throw new NotFoundException exception.
    if (!distributor) {
      throw new NotFoundException(DISTRIBUTORS_NOT_FOUND);
    }

    // get the product by the given id from the createSaleDto
    const product = await this.productsService.getProduct({
      productId: createSaleDto.ProductId,
    });

    // if the product is not found, throw new NotFoundException exception.
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }

    // get the consumer by the given id from the createSaleDto
    const consumer = await this.consumersService.getConsumer({
      consumerId: createSaleDto.ConsumerId,
    });

    // if the consumer is not found, throw new NotFoundException exception.
    if (!consumer) {
      throw new NotFoundException(CONSUMER_NOT_FOUND);
    }

    const productPrice = +product.price;

    // calculate the total amount
    createSaleDto.totalAmount = +createSaleDto.quantitySold * +productPrice;

    // create the new sale
    const sale = await this.salesRepository.create({
      ...createSaleDto,
    });

    // reward the distributor
    await this.rewardsService.rewardDistributor(sale);

    // extend points to consumer
    await this.pointsService.extendPointsToConsumer(sale);

    return sale;
  }

  async findAll() {
    return await this.salesRepository.findAll();
  }

  async findOne(saleId: string) {
    // get the sale with the give id
    const sale = await this.getSale({ saleId });

    // check if the sale with the given id exists
    if (sale) return sale;
    // else throw a not found exception, the sale does not exist
    else throw new NotFoundException(SALE_NOT_FOUND);
  }

  async update(saleId: string, updateSaleDto: UpdateSaleDto) {
    // get the sale with the give id
    const sale = await this.getSale({ saleId });
    let soldProduct: Product;

    // check if the sale with the given id exists
    if (!sale) {
      // throw a not found exception if the sale does not exist
      throw new NotFoundException(SALE_NOT_FOUND);
    }

    // if the distributor id is provided
    if (updateSaleDto.DistributorId) {
      // get the distributor by the given id from the createSaleDto
      const distributor = await this.distributorsService.getDistributor({
        distributorId: updateSaleDto.DistributorId,
      });

      // if the distributor is not found, throw new NotFoundException exception.
      if (!distributor) {
        throw new NotFoundException(DISTRIBUTORS_NOT_FOUND);
      }

      // else update the sale
      sale.DistributorId = updateSaleDto.DistributorId;
    }

    if (updateSaleDto.ProductId) {
      // get the product by the given id from the createSaleDto
      const product = await this.productsService.getProduct({
        productId: updateSaleDto.ProductId,
      });

      // if the product is not found, throw new NotFoundException exception.
      if (!product) {
        throw new NotFoundException(PRODUCT_NOT_FOUND);
      }

      // assign it to the sold product
      soldProduct = product;

      // else update the sale
      sale.ProductId = updateSaleDto.ProductId;
    } else {
      soldProduct = <Product>await this.productsService.getProduct({
        productId: sale.ProductId,
      });
    }

    // if the consumer is being updated
    if (updateSaleDto.ConsumerId) {
      // get the consumer by the given id from the createSaleDto
      const consumer = await this.consumersService.getConsumer({
        consumerId: updateSaleDto.ConsumerId,
      });

      // if the consumer is not found, throw new NotFoundException exception.
      if (!consumer) {
        throw new NotFoundException(CONSUMER_NOT_FOUND);
      }

      // update the sale
      sale.ConsumerId = updateSaleDto.ConsumerId;
    }

    return await sale.save();
  }

  async remove(saleId: string) {
    // get the sale with the give id
    const sale = await this.getSale({ saleId });

    // if the sale does not exist, throw a new NotFoundException
    if (!sale) throw new NotFoundException(SALE_NOT_FOUND);

    // else destroy the sale and return
    return sale.destroy();
  }
}

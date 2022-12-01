import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PRODUCT_NOT_FOUND, PRODUCT_REPOSITORY } from './const';
import { Product } from './entities';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productsRepository: typeof Product,
  ) {}

  async getProduct(options: { productId?: string; name?: string }) {
    let product: Product;
    // if the product id is given, find the product by the product id
    if (options.productId) {
      product = await this.productsRepository.findByPk(options.productId);

      // if the product is not found, return false
      if (!product) return false;
    }
    // else if the product name is given, find the product by the product name
    else if (options.name) {
      product = await this.productsRepository.findOne({
        where: {
          name: options.name,
        },
      });

      // if the product is not found, return false
      if (!product) return false;
    } else return false;

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    // check if there is a product with the given name
    const product = await this.getProduct({
      name: createProductDto.name,
    });

    // if there is, throw a new precondition failed exception
    // for there is an existing product with the given name
    if (product) {
      throw new PreconditionFailedException(
        'Product with the given name already exists',
      );
    }

    // else create the new product
    return await this.productsRepository.create({
      ...createProductDto,
    });
  }

  async findAll() {
    return await this.productsRepository.findAll();
  }

  async findOne(productId: string) {
    // get the product with the give id
    const product = await this.getProduct({ productId });

    // check if the product with the given id exists
    if (product) return product;
    // else throw a not found exception, the product does not exist
    else throw new NotFoundException(PRODUCT_NOT_FOUND);
  }

  async update(productId: string, updateProductDto: UpdateProductDto) {
    // get the product with the give id
    const product = await this.getProduct({ productId });

    // if the product does not exist, throw a new NotFoundException
    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND);

    // if the name is being updated
    if (updateProductDto.name) {
      // check if there is another product with the given name
      const anotherProduct = await this.getProduct({
        name: updateProductDto.name,
      });

      // if there exists a product, throw a new ConflictException error
      if (anotherProduct && product.id !== anotherProduct.id) {
        throw new ConflictException(
          'Product with the given name already exists',
        );
      }
      // else update the name
      else product.name = updateProductDto.name;
    }

    if (updateProductDto.price)
      // if the product's price is given, update the price
      product.price = +updateProductDto.price;

    return await product.save();
  }

  async remove(productId: string) {
    // get the product with the give id
    const product = await this.getProduct({ productId });

    // if the product does not exist, throw a new NotFoundException
    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND);

    // else destroy the product and return
    return product.destroy();
  }
}

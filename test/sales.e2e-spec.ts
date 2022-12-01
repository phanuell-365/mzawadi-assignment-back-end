import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { CreateProductDto } from '../src/products/dto';
import { CreateDistributorDto } from '../src/distributors/dto';
import { CreateSaleDto, UpdateSaleDto } from '../src/sales/dto';
import { CreateConsumerDto } from '../src/consumers/dto';

describe('Mzawadi Loyalty Assignment - Sales Test (e2e)', () => {
  let saleApp: INestApplication;

  jest.setTimeout(15000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    saleApp = moduleFixture.createNestApplication();

    saleApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await saleApp.init();

    await saleApp.listen(process.env.TEST_PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.TEST_PORT}`);
  });

  afterAll(async () => {
    await saleApp.close();
  });

  describe('The Auth Module', function () {
    const authDto: AuthDto = {
      username: 'Admin',
      password: 'admin',
    };

    describe('Login', function () {
      it('should return an object having an access_token', function () {
        return pactum
          .spec()
          .post('/auth/users/login')
          .withBody({ ...authDto })
          .expectStatus(201)
          .inspect()
          .stores('accessToken', 'access_token');
      });
    });
  });

  describe('Consumers Module', function () {
    let consumerOneId: string;
    describe('Create a new Consumer', function () {
      const createConsumerDto: CreateConsumerDto = {
        name: 'Diana Elliot',
        email: 'dianaelliot@localhost.com',
        phone: '0749494882',
      };
      it('should return a new consumer', async function () {
        const res = await pactum
          .spec()
          .post('/consumers')
          .withBody({ ...createConsumerDto })
          .expectStatus(201)
          .inspect()
          .stores('consumerOneId', 'id')
          .toss();

        const consumer = res.body;

        consumerOneId = consumer.id;
      });
    });

    describe('Get consumer by id', function () {
      it('should return a consumer with the given id', function () {
        return pactum
          .spec()
          .get('/consumers/{id}')
          .withPathParams({ id: consumerOneId })
          .inspect()
          .expectStatus(200)
          .expectJsonLike({ id: consumerOneId });
      });
    });
  });

  describe('Products Module', function () {
    describe('Create a new Product', function () {
      const createProductDto: CreateProductDto = {
        name: 'Margarine',
        price: 200,
      };

      it('should return a new product', function () {
        return pactum
          .spec()
          .post('/products')
          .withBody({ ...createProductDto })
          .expectStatus(201)
          .stores('productOneId', 'id')
          .inspect();
      });
    });

    describe('Get product by id', function () {
      it('should return a product with the given id', function () {
        return pactum
          .spec()
          .get('/products/{id}')
          .withPathParams('id', '$S{productOneId}')
          .inspect()
          .expectStatus(200)
          .expectJsonLike({ id: '$S{productOneId}' });
      });
    });

    describe('Create another product', function () {
      const createNewProduct: CreateProductDto = {
        name: 'Milk',
        price: 60,
      };
      it('should return the newly created product', function () {
        return pactum
          .spec()
          .post('/products')
          .withBody({ ...createNewProduct })
          .expectStatus(201)
          .stores('productTwoId', 'id')
          .inspect();
      });
    });
  });

  describe('Distributors Module', function () {
    describe('Create a new Distributor', function () {
      const createDistributorDto: CreateDistributorDto = {
        name: 'Jane Austine',
        email: 'janeaustine@localhost.com',
        phone: '0739390245',
      };
      it('should return a new distributor', function () {
        return pactum
          .spec()
          .post('/distributors')
          .withBody({ ...createDistributorDto })
          .stores('distributorOneId', 'id')
          .expectStatus(201)
          .inspect();
      });
    });

    describe('Get distributor by id', function () {
      it('should return a distributor with the given id', function () {
        return pactum
          .spec()
          .get('/distributors/{id}')
          .withPathParams('id', '$S{distributorOneId}')
          .inspect()
          .expectStatus(200)
          .expectJsonLike({ id: '$S{distributorOneId}' });
      });
    });
  });

  let saleOneId: string;

  describe('Sales Module', function () {
    // const createSaleDto: CreateSaleDto = {
    //   DistributorId: distributorOneId,
    //   ProductId: productOneId,
    //   // valueOfSalesSale: 0,
    //   salesSale: 2,
    // };

    const createSaleDto: CreateSaleDto = {
      ConsumerId: '$S{consumerOneId}',
      DistributorId: '$S{distributorOneId}',
      ProductId: '$S{productOneId}',
      // valueOfSalesSale: 0,
      // salesSale: 2,
    };

    describe('Create a new Sale', function () {
      it('should return a new sale', async function () {
        const res = await pactum
          .spec()
          .post('/sales')
          .withBody({ ...createSaleDto })
          .inspect()
          .stores('saleOneId', 'id')
          .expectStatus(201)
          .toss();

        const sale = res.body;

        saleOneId = sale.id;
      });
    });

    describe('Get all sales', function () {
      it('should return all the available sales', function () {
        return pactum.spec().get('/sales').inspect().expectStatus(200);
      });
    });

    describe('Get sale by id', function () {
      it('should return a sale by the specified id', function () {
        return pactum
          .spec()
          .get('/sales/{id}')
          .withPathParams({ id: saleOneId })
          .inspect()
          .expectStatus(200);
      });
    });

    describe('Update the product id', function () {
      const updateSaleDto: UpdateSaleDto = {
        ProductId: '$S{productTwoId}',
      };
      it('should return an updated sale', function () {
        return pactum
          .spec()
          .patch('/sales/{id}')
          .withBody({ ...updateSaleDto })
          .withPathParams({ id: saleOneId })
          .inspect()
          .expectStatus(200);
      });
    });

    describe('Get all sales', function () {
      it('should return all the available sales', function () {
        return pactum.spec().get('/sales').inspect().expectStatus(200);
      });
    });
  });
});

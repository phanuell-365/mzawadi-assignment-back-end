import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { CreateProductDto } from '../src/products/dto';
import { CreateDistributorDto } from '../src/distributors/dto';
import { CreateSaleDto, UpdateSaleDto } from '../src/sales/dto';
import { CreateConsumerDto } from '../src/consumers/dto';
import { CreateTargetDto } from '../src/targets/dto';

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
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
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
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
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
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
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
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
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
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
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
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
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
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
          .expectStatus(200)
          .expectJsonLike({ id: '$S{distributorOneId}' });
      });
    });
  });

  describe('Targets Module', function () {
    const createTargetDto: CreateTargetDto = {
      DistributorId: '$S{distributorOneId}',
      ProductId: '$S{productOneId}',
      salesTarget: 200,
    };

    describe('Create a new Target', function () {
      it('should return a new target', function () {
        return pactum
          .spec()
          .post('/targets')
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
          .withBody({ ...createTargetDto })
          .inspect()
          .stores('targetOneId', 'id')
          .expectStatus(201);
      });
    });

    describe('Get all targets', function () {
      it('should return all the available targets', function () {
        return pactum
          .spec()
          .get('/targets')
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
          .inspect()
          .expectStatus(200);
      });
    });
  });

  let saleOneId: string;

  describe('Sales Module', function () {
    const createSaleDto: CreateSaleDto = {
      quantitySold: 10,
      ConsumerId: '$S{consumerOneId}',
      DistributorId: '$S{distributorOneId}',
      ProductId: '$S{productOneId}',
    };

    describe('Create a new Sale', function () {
      it('should return a new sale', async function () {
        const res = await pactum
          .spec()
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
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
        return pactum
          .spec()
          .get('/sales')
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
          .inspect()
          .expectStatus(200);
      });
    });

    describe('Get sale by id', function () {
      it('should return a sale by the specified id', function () {
        return pactum
          .spec()
          .get('/sales/{id}')
          .withPathParams({ id: saleOneId })
          .inspect()
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
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
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
          .expectStatus(200);
      });
    });

    describe('Get all sales', function () {
      it('should return all the available sales', function () {
        return pactum
          .spec()
          .get('/sales')
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
          .inspect()
          .expectStatus(200);
      });
    });

    describe('Targets Module', function () {
      const createTargetDto: CreateTargetDto = {
        DistributorId: '$S{distributorOneId}',
        ProductId: '$S{productTwoId}',
        salesTarget: 100,
      };

      describe('Create a new Target', function () {
        it('should return a new target', function () {
          return pactum
            .spec()
            .post('/targets')
            .withBody({ ...createTargetDto })
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .inspect()
            .stores('targetOneId', 'id')
            .expectStatus(201);
        });
      });
    });

    describe('Make another sale', function () {
      it('should return a new sale', function () {
        const anotherSaleDto: CreateSaleDto = {
          quantitySold: 10,
          ConsumerId: '$S{consumerOneId}',
          DistributorId: '$S{distributorOneId}',
          ProductId: '$S{productTwoId}',
        };

        return pactum
          .spec()
          .post('/sales')
          .withBody({ ...anotherSaleDto })
          .inspect()
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
          .stores('saleOneId', 'id')
          .expectStatus(201);
      });
    });

    describe('Get all sales', function () {
      it('should return all the available sales', function () {
        return pactum
          .spec()
          .get('/sales')
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
          .inspect()
          .expectStatus(200);
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { CreateProductDto } from '../src/products/dto';
import { CreateDistributorDto } from '../src/distributors/dto';
import { CreateTargetDto, UpdateTargetDto } from '../src/targets/dto';

describe('Mzawadi Loyalty Assignment - Targets Test (e2e)', () => {
  let targetApp: INestApplication;

  jest.setTimeout(15000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    targetApp = moduleFixture.createNestApplication();

    targetApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await targetApp.init();

    await targetApp.listen(process.env.TEST_PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.TEST_PORT}`);
  });

  afterAll(async () => {
    await targetApp.close();
  });

  describe('WorkFlow Module', function () {
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

  let productOneId: string;

  describe('Products Module', function () {
    describe('Create a new Product', function () {
      const createProductDto: CreateProductDto = {
        name: 'Margarine',
        price: 200,
      };

      it('should return a new product', async function () {
        const res = await pactum
          .spec()
          .post('/products')
          .withBody({ ...createProductDto })
          .expectStatus(201)
          .stores('productOneId', 'id')
          .inspect()
          .toss();

        const product = res.body;

        productOneId = product.id;
      });
    });

    describe('Get product by id', function () {
      it('should return a product with the given id', function () {
        return pactum
          .spec()
          .get('/products/{id}')
          .withPathParams({ id: productOneId })
          .inspect()
          .expectStatus(200)
          .expectJsonLike({ id: productOneId });
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

  let distributorOneId: string;

  describe('Distributors Module', function () {
    describe('Create a new Distributor', function () {
      const createDistributorDto: CreateDistributorDto = {
        name: 'Jane Austine',
        email: 'janeaustine@localhost.com',
        phone: '0739390245',
      };
      it('should return a new distributor', async function () {
        const res = await pactum
          .spec()
          .post('/distributors')
          .withBody({ ...createDistributorDto })
          .stores('distributorOneId', 'id')
          .expectStatus(201)
          .inspect()
          .toss();

        const distributor = res.body;

        distributorOneId = distributor.id;
      });
    });

    describe('Get distributor by id', function () {
      it('should return a distributor with the given id', function () {
        return pactum
          .spec()
          .get('/distributors/{id}')
          .withPathParams({ id: distributorOneId })
          .inspect()
          .expectStatus(200)
          .expectJsonLike({ id: distributorOneId });
      });
    });
  });

  let targetOneId: string;

  describe('Targets Module', function () {
    // const createTargetDto: CreateTargetDto = {
    //   DistributorId: distributorOneId,
    //   ProductId: productOneId,
    //   // valueOfSalesTarget: 0,
    //   salesTarget: 2,
    // };

    const createTargetDto: CreateTargetDto = {
      DistributorId: '$S{distributorOneId}',
      ProductId: '$S{productOneId}',
      // valueOfSalesTarget: 0,
      salesTarget: 2,
    };

    describe('Create a new Target', function () {
      it('should return a new target', async function () {
        const res = await pactum
          .spec()
          .post('/targets')
          .withBody({ ...createTargetDto })
          .inspect()
          .stores('targetOneId', 'id')
          .expectStatus(201)
          .toss();

        const target = res.body;

        targetOneId = target.id;
      });
    });

    describe('Get all targets', function () {
      it('should return all the available targets', function () {
        return pactum.spec().get('/targets').inspect().expectStatus(200);
      });
    });

    describe('Get target by id', function () {
      it('should return a target by the specified id', function () {
        return pactum
          .spec()
          .get('/targets/{id}')
          .withPathParams({ id: targetOneId })
          .inspect()
          .expectStatus(200);
      });
    });

    describe('Update the product id', function () {
      const updateTargetDto: UpdateTargetDto = {
        ProductId: '$S{productTwoId}',
      };
      it('should return an updated target', function () {
        return pactum
          .spec()
          .patch('/targets/{id}')
          .withBody({ ...updateTargetDto })
          .withPathParams({ id: targetOneId })
          .inspect()
          .expectStatus(200);
      });
    });

    describe('Get all targets', function () {
      it('should return all the available targets', function () {
        return pactum.spec().get('/targets').inspect().expectStatus(200);
      });
    });
  });
});

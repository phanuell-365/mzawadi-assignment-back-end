import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { CreateProductDto } from '../src/products/dto';

describe('Mzawadi Loyalty Assignment - Products Test (e2e)', () => {
  let productApp: INestApplication;

  jest.setTimeout(15000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    productApp = moduleFixture.createNestApplication();

    productApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await productApp.init();

    await productApp.listen(process.env.TEST_PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.TEST_PORT}`);
  });

  afterAll(async () => {
    await productApp.close();
  });

  describe('Authentication Module', function () {
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

  describe('Products Module', function () {
    let productOneId: string;

    describe('Create a new Product', function () {
      const createProductDto: CreateProductDto = {
        name: 'Yoghurt',
        price: 200,
      };

      it('should return a new product', async function () {
        const res = await pactum
          .spec()
          .post('/products')
          .withBody({ ...createProductDto })
          .expectStatus(201)
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
  });
});

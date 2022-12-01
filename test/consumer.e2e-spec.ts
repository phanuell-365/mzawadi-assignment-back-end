import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { CreateConsumerDto } from '../src/consumers/dto';

describe('DMS (e2e)', () => {
  let consumerApp: INestApplication;

  jest.setTimeout(15000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    consumerApp = moduleFixture.createNestApplication();

    consumerApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await consumerApp.init();

    await consumerApp.listen(process.env.TEST_PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.TEST_PORT}`);
  });

  afterAll(async () => {
    await consumerApp.close();
  });

  describe('Workflow Module', function () {
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
        name: 'John Doe',
        email: 'johndoe@localhost.com',
        phone: '0749494882',
      };
      it('should return a new consumer', async function () {
        const res = await pactum
          .spec()
          .post('/consumers')
          .withBody({ ...createConsumerDto })
          .expectStatus(201)
          .inspect()
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
});

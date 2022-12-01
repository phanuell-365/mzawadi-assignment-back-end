import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { CreateDistributorDto } from '../src/distributors/dto';

describe('Mzawadi Loyalty Assignment - Distributors Test (e2e)', () => {
  let distributorApp: INestApplication;

  jest.setTimeout(15000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    distributorApp = moduleFixture.createNestApplication();

    distributorApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await distributorApp.init();

    await distributorApp.listen(process.env.TEST_PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.TEST_PORT}`);
  });

  afterAll(async () => {
    await distributorApp.close();
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

  describe('Distributors Module', function () {
    let distributorOneId: string;
    describe('Create a new Distributor', function () {
      const createDistributorDto: CreateDistributorDto = {
        name: 'Michael Doe',
        email: 'michaeldoe@localhost.com',
        phone: '0749494882',
      };
      it('should return a new distributor', async function () {
        const res = await pactum
          .spec()
          .post('/distributors')
          .withBody({ ...createDistributorDto })
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
});

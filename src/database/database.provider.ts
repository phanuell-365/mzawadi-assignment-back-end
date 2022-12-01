import { SEQUELIZE } from './const';
import { DbConfig } from './enum';
import { databaseConfig } from './database.config';
import { Sequelize } from 'sequelize-typescript';
import { InternalServerErrorException } from '@nestjs/common';
import { User } from '../users/entities';
import { Consumer } from '../consumers/entities';
import { Distributor } from '../distributors/entities';
import { Product } from '../products/entities';
import { Target } from '../targets/entities';
import { Sale } from '../sales/entities';

export const databaseProvider = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DbConfig.DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case DbConfig.PRODUCTION:
          config = databaseConfig.production;
          break;
        case DbConfig.TEST:
          config = databaseConfig.test;
          break;
        default:
          config = databaseConfig.development;
      }

      const sequelize = new Sequelize(config);

      sequelize.addModels([User, Consumer, Distributor, Product, Target, Sale]);

      try {
        switch (process.env.NODE_ENV) {
          case DbConfig.TEST:
            await sequelize.sync({ force: true });
            break;
          case DbConfig.DEVELOPMENT:
            // await sequelize.sync({ force: true });
            await sequelize.sync({});
            break;
          case DbConfig.PRODUCTION:
            await sequelize.sync();
            break;
          default:
            await sequelize.sync();
        }
      } catch (error) {
        console.error(error.message);
        throw new InternalServerErrorException('Error while syncing database');
      }

      return sequelize;
    },
  },
];

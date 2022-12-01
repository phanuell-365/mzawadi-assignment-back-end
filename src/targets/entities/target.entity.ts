import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Distributor } from '../../distributors/entities';
import { Product } from '../../products/entities';

@Table({
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class Target extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    unique: true,
  })
  id: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  salesTarget: number;

  // a distributor has target for a certain product's sale
  @ForeignKey(() => Distributor)
  DistributorId: string;

  @BelongsTo(() => Distributor, 'DistributorId')
  distributor: Distributor;

  // there is a target for a certain product for a distributor
  @ForeignKey(() => Product)
  ProductId: string;

  @BelongsTo(() => Product, 'ProductId')
  product: Product;
}

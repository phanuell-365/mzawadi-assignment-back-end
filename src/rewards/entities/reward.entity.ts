import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
} from 'sequelize-typescript';
import { Distributor } from '../../distributors/entities';
import { Product } from '../../products/entities';

export class Reward extends Model {
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
    defaultValue: 3,
  })
  rebateRate: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    defaultValue: 3,
  })
  rebatePercent: number;

  @Column({
    allowNull: false,
    defaultValue: 3,
    type: DataType.INTEGER,
  })
  rebateAmount: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  numOfSalesOnRebate: number;

  // valueOfNumberOfSales: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    defaultValue: 3,
  })
  numOfSalesBeforeNextRebate: number;

  @CreatedAt
  dateOfRebate: Date;

  @ForeignKey(() => Distributor)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  DistributorId: string;

  @BelongsTo(() => Distributor, 'DistributorId')
  distributor: Distributor;

  @ForeignKey(() => Product)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  ProductId: string;

  @BelongsTo(() => Product, 'ProductId')
  product: Product;
}

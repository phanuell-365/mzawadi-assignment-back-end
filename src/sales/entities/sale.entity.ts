import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Consumer } from '../../consumers/entities';
import { Product } from '../../products/entities';
import { Distributor } from '../../distributors/entities';

@Table({
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class Sale extends Model {
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
  quantitySold: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  totalAmount: number;

  @ForeignKey(() => Consumer)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  ConsumerId: string;

  @BelongsTo(() => Consumer, 'ConsumerId')
  consumer: Consumer;

  @ForeignKey(() => Product)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  ProductId: string;

  @BelongsTo(() => Product, 'ProductId')
  product: Product;

  @ForeignKey(() => Distributor)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  DistributorId: string;

  @BelongsTo(() => Distributor, 'DistributorId')
  distributor: Distributor;
}

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Sale } from '../../sales/entities';

@Table({
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class Point extends Model {
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  valueOfPoints: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  points: number;

  @ForeignKey(() => Sale)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  SaleId: string;

  @BelongsTo(() => Sale, 'SaleId')
  sale: Sale;
}

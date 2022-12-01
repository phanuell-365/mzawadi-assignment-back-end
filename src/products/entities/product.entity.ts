import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class Product extends Model {
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
    type: DataType.STRING,
    unique: true,
  })
  name: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  price: number;

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
}

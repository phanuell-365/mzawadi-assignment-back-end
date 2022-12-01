import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class Distributor extends Model {
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
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  phone: string;
}

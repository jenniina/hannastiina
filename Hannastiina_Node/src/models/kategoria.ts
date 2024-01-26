import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class Kategoria extends Model {
  public id!: number
  public kategoria!: number
  orderIndex!: number
}

Kategoria.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kategoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Kategoria',
    tableName: 'kategoriat',
    timestamps: true,
  }
)

export default Kategoria

import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class Esittely extends Model {
  public id!: number
  public esittely!: string
}

Esittely.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    esittely: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Esittely',
    tableName: 'esittely',
    timestamps: true,
  }
)

export default Esittely

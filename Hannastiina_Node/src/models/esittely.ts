import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'
import Kayttaja from './user'

class Esittely extends Model {
  public id!: number
  public esittely!: string
  public viimeisinMuokkaus!: number
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
    viimeisinMuokkaus: {
      type: DataTypes.INTEGER,
      references: {
        model: Kayttaja,
        key: 'id',
      },
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

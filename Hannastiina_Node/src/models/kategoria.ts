import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'
import Kayttaja from './user'

class Kategoria extends Model {
  public id!: number
  public kategoria!: number
  public orderIndex!: number
  public viimeisinMuokkaus!: number
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
    modelName: 'Kategoria',
    tableName: 'kategoriat',
    timestamps: true,
  }
)

export default Kategoria

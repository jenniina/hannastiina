import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'
import Palvelu from './palvelu'

class Jarjestys extends Model {
  public id!: number
  public jarjestys!: number
}

Jarjestys.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    jarjestys: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    palveluId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Palvelu',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Jarjestys',
    tableName: 'jarjestys',
    timestamps: false,
  }
)

export default Jarjestys

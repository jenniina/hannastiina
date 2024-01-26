import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'
import Kategoria from './kategoria'
import Jarjestys from './jarjestys'

class Palvelu extends Model {
  public id!: number
  public kategoria!: number
  public nimi!: string
  public tarkennus!: string
  public hinta!: number
  public kesto!: number
  public kuvaus!: string
}

Palvelu.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kategoria: {
      type: DataTypes.INTEGER,
      references: {
        model: Kategoria,
        key: 'id',
      },
    },
    nimi: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tarkennus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hinta: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isNumeric: true,
      },
    },
    kesto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isNumeric: true,
      },
    },
    kuvaus: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Palvelu',
    tableName: 'palvelut',
    timestamps: true,
  }
)

export default Palvelu

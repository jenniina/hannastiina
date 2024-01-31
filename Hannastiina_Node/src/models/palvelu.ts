import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'
import Kategoria from './kategoria'
import Kayttaja from './user'

class Palvelu extends Model {
  public id!: number
  public kategoria!: number
  public nimi!: string
  public tarkennus!: string
  public hinta!: number
  public hinta2!: number
  public kesto!: number
  public kuvaus!: string
  public viimeisinMuokkaus!: number
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
    hinta2: {
      type: DataTypes.FLOAT,
      allowNull: true,
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
    modelName: 'Palvelu',
    tableName: 'palvelut',
    timestamps: true,
  }
)

export default Palvelu

import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'
import { IUser as UserAttributes } from '../types'

// interface UserAttributes {
//   id?: number
//   username: string
//   name: string
//   password: string
//   role: number
//   token?: string
//   resetToken?: string
//   confirmToken?: string
// }

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number
  public _id!: string
  public username!: string
  public name!: string
  public password!: string
  public role!: number
  public token?: string

  // Other associations or methods can be added here

  public static initModel(): void {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        _id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          unique: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            len: [3, 255],
          },
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            len: [2, 255],
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: [3, 255],
          },
        },
        role: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          validate: {
            min: 0,
            max: 3,
          },
        },
        token: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'kayttajat',
        timestamps: true,
      }
    )
  }
}

User.initModel()

export default User

export interface ITokenPayload {
  userId: string | undefined
  iat?: number
  exp?: number
}
export interface IToken {
  token: string | undefined
  createdAt: Date
}

// public id!: number
// public username!: string
// public name!: string
// public password!: string
// public role!: number
// public token?: string
// public resetToken?: string
// public confirmToken?: string

export interface IUser {
  id?: number
  _id?: string
  username: string
  name: string
  password: string
  passwordOld?: string
  role?: number
  token?: string
  createdAt?: string
  updatedAt?: string
}

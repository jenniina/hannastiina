export interface RefObject<T> {
  readonly current: T | null
}
export type credentials = {
  username: string
  password: string
}

export interface IOrderBy {
  id?: number
  jarjestys: number
  palveluId: IService['id']
}

export interface IOrderByState {
  orderBy: IOrderBy[] | null
  loading: boolean
  error: string | undefined | null
}

export interface ICategory {
  id?: number
  kategoria: string
  info: string
  orderIndex: number
  viimeisinMuokkaus: number
}
export interface ICategoryState {
  categories: ICategory[]
  loading: boolean
  error: string | undefined
}
export interface IService {
  id?: number
  kategoria: number
  nimi: string
  tarkennus: string
  hinta: number
  hinta2: number | null
  kesto: number
  kuvaus: string
  viimeisinMuokkaus: number
}
export interface IServiceState {
  services: IService[]
  loading: boolean
  error: string | null
}

export interface IIntroState {
  esittely: IIntro[]
  loading: boolean
  error: string | null
}
export interface IIntro {
  id?: number
  esittely: string
  viimeisinMuokkaus: number
}

export interface IClosestItem {
  offset: number
  element?: HTMLElement
}
export interface ICategoryItems {
  [key: string]: IService[] | undefined
}

export interface IUser {
  id?: number
  _id?: string
  username: string
  name?: string
  password: string
  passwordOld?: string
  role?: number
  verified?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface IReducers {
  categories: ICategoryState
  services: IServiceState
  orderBy: IOrderByState
  intro: IIntroState
  users: { user: IUser; users: IUser[] }
  notification: { message: string; isError: boolean; seconds: number }
}

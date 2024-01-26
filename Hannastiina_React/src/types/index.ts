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
  orderIndex: number
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
  kesto: number
  kuvaus: string
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
}

export interface IClosestItem {
  offset: number
  element?: HTMLElement
}
export interface ICategoryItems {
  [key: string]: IService[] | undefined
}

export interface IUser {
  id?: string
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

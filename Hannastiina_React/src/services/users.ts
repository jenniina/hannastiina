import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { IUser as user, credentials } from '../types'

const VITE_BASE_URI = import.meta.env.VITE_BASE_URI
const baseUrl = VITE_BASE_URI ? `${VITE_BASE_URI}/api/kayttajat` : '/api/kayttajat'

let token: string | null = null
let config: AxiosRequestConfig<any> | undefined

const setToken = (newToken: string | null) => {
  token = `Bearer ${newToken}`
  config = {
    headers: { Authorization: token },
  }
}

export const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('HannastiinaToken')}`,
  },
})

const login = async (credentials: credentials) => {
  const response = await axios.post(`${baseUrl}/kirjaudu`, credentials, config)
  const { token, user } = response.data
  localStorage.setItem('HannastiinaToken', token)
  localStorage.setItem('HannastiinaUser', JSON.stringify({ user, token }))
  return response.data
}

const getAll = async (dispatch: (arg0: { payload: any; type: string }) => void) => {
  try {
    const response = await axios.get(baseUrl, getConfig())
    return response.data
  } catch (error) {
    if (
      (error as AxiosError<any>).response &&
      (error as AxiosError<any>)?.response?.data.message === 'jwt expired'
    ) {
      dispatch({
        type: 'users/logoutUser',
        payload: undefined,
      })
    }
    throw error
  }
}

const createNewUser = async (newUser: user) => {
  const response = await axios.post(`${baseUrl}`, newUser, getConfig())
  return response.data
}

const deleteUser = async (id: user['_id']) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
  return response.data as AxiosResponse<{ success: boolean; message: string }>
}

const updateUser = async (user: Pick<user, '_id' | 'name' | 'passwordOld'>) => {
  const newUserSettings = {
    _id: user._id,
    name: user.name,
    passwordOld: user.passwordOld,
  }
  const response = await axios.put(`${baseUrl}/${user._id}`, newUserSettings)
  return response.data
}

const updateUsername = async (user: Pick<user, '_id' | 'username' | 'passwordOld'>) => {
  const newUserSettings = {
    _id: user._id,
    username: user.username,
    passwordOld: user.passwordOld,
  }
  const response = await axios.put(`${baseUrl}/sposti`, newUserSettings)
  return response.data
}
const updatePassword = async (user: Pick<user, '_id' | 'password' | 'passwordOld'>) => {
  const newUserSettings = {
    _id: user._id,
    password: user.password,
    passwordOld: user.passwordOld,
  }
  const response = await axios.put(`${baseUrl}/${user._id}`, newUserSettings)
  return response.data
}

const updateToken = async (user: Pick<user, 'username'>) => {
  const response = await axios.put(`${baseUrl}/request-new-token`, user)
  return response.data
}

const searchUsername = async (username: string) => {
  const response = await axios.get(`${baseUrl}/username/${username}`)
  return response.data
}

const searchId = async (id: string | undefined) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data as user
}

const forgot = async (username: string | undefined) => {
  const response = await axios.post(`${baseUrl}/forgot`, { username })
  return response.data
}

export default {
  getAll,
  createNewUser,
  deleteUser,
  updateUser,
  updateUsername,
  updatePassword,
  searchUsername,
  searchId,
  setToken,
  updateToken,
  login,
  forgot,
}

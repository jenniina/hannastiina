// router.get('/esittely', getIntro)
// router.post('/esittely', addOrEditIntro)
// router.put('/esittely/:id', addOrEditIntro)
// router.delete('/esittely/:id', deleteIntro)

import axios from 'axios'
import { IIntro } from '../types'
import { getConfig } from './users'

const VITE_BASE_URI = import.meta.env.VITE_BASE_URI
const baseUrl = VITE_BASE_URI ? `${VITE_BASE_URI}/api/esittely` : '/api/esittely'

const getIntro = async (): Promise<IIntro[]> => {
  const response = await axios.get(baseUrl)
  return response.data
}

// const addIntro = async (newObject: string): Promise<string> => {
//   const response = await axios.post(baseUrl, newObject)
//   return response.data
// }

const updateIntro = async (id: number, newObject: string): Promise<string> => {
  const response = await axios.put(
    `${baseUrl}/${id}`,
    { esittely: newObject },
    getConfig()
  )
  return response.data
}

// const deleteIntro = async (id: number): Promise<string> => {
//   const response = await axios.delete(`${baseUrl}/${id}`)
//   return response.data
// }

export default {
  getIntro,
  updateIntro,
  // addIntro,
  // deleteIntro,
}

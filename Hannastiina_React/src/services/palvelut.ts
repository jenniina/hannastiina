// router.get('/palvelut', getAll)
// router.get('/palvelut/hinta/:price', getServiceByPrice)
// router.get('/palvelut/nimi/:name', getServiceByName)
// router.post('/palvelut', addService)
// router.put('/palvelut/:id', updateService)
// router.delete('/palvelut/:id', deleteService)

import { getConfig } from './users'

import axios from 'axios'
import { IService } from '../types'

const VITE_BASE_URI = import.meta.env.VITE_BASE_URI
const baseUrl = VITE_BASE_URI ? `${VITE_BASE_URI}/api/palvelut` : '/api/palvelut'

const getAll = async (): Promise<IService[]> => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getServiceByName = async (name: string): Promise<IService[]> => {
  const response = await axios.get(`${baseUrl}/nimi/${name}`)
  return response.data
}

const addService = async (newObject: IService): Promise<IService> => {
  const response = await axios.post(baseUrl, newObject, getConfig())
  return response.data
}

const updateService = async (id: number, newObject: IService): Promise<IService> => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject, getConfig())
  return response.data
}

const deleteService = async (id: number): Promise<IService> => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
  return response.data
}

const searchPriceRange = async (min: number, max: number): Promise<IService[]> => {
  const response = await axios.get(`${baseUrl}/hinta/${min}/${max}`)
  return response.data
}

export default {
  getAll,
  searchPriceRange,
  getServiceByName,
  addService,
  updateService,
  deleteService,
}

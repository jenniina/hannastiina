import { IOrderBy } from '../types/index'
import axios from 'axios'
import { getConfig } from './users'

// router.get('/palvelut/jarjestys', getOrder)
// router.post('/palvelut/jarjestys', addOrder)
// router.put('/palvelut/jarjestys/:id', updateOrder)
// router.delete('/palvelut/jarjestys/:id', deleteOrder)

const VITE_BASE_URI = import.meta.env.VITE_BASE_URI
const baseUrl = VITE_BASE_URI ? `${VITE_BASE_URI}/api/jarjestys` : '/api/jarjestys'

const getAll = async (): Promise<IOrderBy[]> => {
  const response = await axios.get(baseUrl)
  return response.data
}

const updateOrder = async (jarjestys: IOrderBy[]): Promise<IOrderBy[]> => {
  const response = await axios.put(`${baseUrl}`, { jarjestys }, getConfig())
  return response.data
}

export default {
  getAll,
  updateOrder,
}

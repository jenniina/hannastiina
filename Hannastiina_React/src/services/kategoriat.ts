// router.get('/kategoriat', getCategories)
// router.post('/kategoriat', addCategory)
// router.put('/kategoriat/:id', updateCategory)
// router.delete('/kategoriat/:id', deleteCategory)
import { getConfig } from './users'

import axios from 'axios'
import { ICategory } from '../types'

const VITE_BASE_URI = import.meta.env.VITE_BASE_URI
const baseUrl = VITE_BASE_URI ? `${VITE_BASE_URI}/api/kategoriat` : '/api/kategoriat'

const getAll = async (): Promise<ICategory[]> => {
  const response = await axios.get(baseUrl)
  return response.data
}

const addCategory = async (newObject: {
  kategoria: string
  viimeisinMuokkaus: number
}): Promise<ICategory> => {
  const response = await axios.post(baseUrl, newObject, getConfig())
  return response.data
}

const updateCategory = async (
  id: number,
  categoryObject: ICategory
): Promise<ICategory> => {
  const response = await axios.put(`${baseUrl}/${id}`, categoryObject, getConfig())
  return response.data
}

const deleteCategory = async (id: number): Promise<ICategory> => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
  return response.data
}

// const updateCategoryOrder = async (req: Request, res: Response): Promise<void> => {
//     const { order } = req.body

//     if (!Array.isArray(order)) {
//       res.status(400).json({
//         success: false,
//         message: 'Invalid order format. It should be an array of category IDs.',
//       })
//       return
//     }
//     router.put('/kategoriat', updateCategoryOrder)
//     example: const order = [1, 2, 3, 4, 5]

// const getCategoryOrder = async (req: Request, res: Response): Promise<void> => {
//     //the order is by what order the categories are in the database

//     try {
//       const categories = await Kategoria.findAll()
//       const order = categories.map((category) => category.id)

//       res.status(200).json(order)
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Virhe kategorioiden hakemisessa',
//         error,
//       })
//       console.error('Error:', error)
//     }
//   }
//   router.get('/kategoriat/jarjestys', getCategoryOrder)

const getCategoryOrder = async (): Promise<ICategory['orderIndex'][]> => {
  const response = await axios.get(`${baseUrl}/jarjestys`)
  return response.data
}

const updateCategoryOrder = async (
  order: ICategory['orderIndex'][]
): Promise<ICategory[]> => {
  const response = await axios.put(`${baseUrl}`, { order }, getConfig())
  return response.data
}

export default {
  getAll,
  addCategory,
  updateCategory,
  getCategoryOrder,
  updateCategoryOrder,
  deleteCategory,
}

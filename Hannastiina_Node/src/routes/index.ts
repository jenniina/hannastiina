import {
  getIntro,
  addOrEditIntro,
  deleteIntro,
  getAll,
  getServiceByName,
  addService,
  updateService,
  deleteService,
  searchPriceRange,
  getCategories,
  addCategory,
  updateCategory,
  getCategoryOrder,
  updateCategoryOrder,
  deleteCategory,
  getOrder,
  addOrder,
  updateOrder,
  deleteOrder,
  getUsers,
  getUser,
  addUser,
  updateUser,
  updateUsername,
  deleteUser,
  generateToken,
  verifyToken,
  verifyTokenMiddleware,
  checkIfAdmin,
  authenticateUser,
  loginUser,
  comparePassword,
} from '../controllers'

import { Router } from 'express'

const router = Router()

router.get('/palvelut', getAll)
router.get('/palvelut/nimi/:name', getServiceByName)
router.post('/palvelut', addService)
router.put('/palvelut/:id', updateService)
router.delete('/palvelut/:id', [authenticateUser, deleteService])
router.get('/palvelut/hinta/:min/:max', searchPriceRange)

router.get('/esittely', getIntro)
router.post('/esittely', [authenticateUser, addOrEditIntro])
router.put('/esittely/:id', [authenticateUser, addOrEditIntro])
router.delete('/esittely/:id', [authenticateUser, deleteIntro])

router.get('/kategoriat', getCategories)
router.post('/kategoriat', addCategory)
router.put('/kategoriat/:id', [authenticateUser, updateCategory])
router.get('/kategoriat/jarjestys', getCategoryOrder)
router.put('/kategoriat', [authenticateUser, updateCategoryOrder])
router.delete('/kategoriat/:id', [authenticateUser, deleteCategory])

router.get('/jarjestys', getOrder)
router.post('/jarjestys', [authenticateUser, addOrder])
router.delete('/jarjestys/:id', deleteOrder)
router.put('/jarjestys', [authenticateUser, updateOrder])

router.get('/kayttajat', [checkIfAdmin, getUsers])
router.get('/kayttajat/:id', [checkIfAdmin, getUser])
router.post('/kayttajat', [checkIfAdmin, addUser])
router.put('/kayttajat/:id', [comparePassword, updateUser])
router.put('/kayttajat/:id/sposti', [comparePassword, updateUsername])
router.delete('/kayttajat/:id', [checkIfAdmin, deleteUser])
router.post('/kayttajat/kirjaudu', loginUser)

export default router

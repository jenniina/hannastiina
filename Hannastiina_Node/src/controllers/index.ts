import { Request, Response, NextFunction } from 'express'
import { Op, literal } from 'sequelize'
import Palvelu from '../models/palvelu'
import Esittely from '../models/esittely'
import Kategoria from '../models/kategoria'
import Jarjestys from '../models/jarjestys'
import User from '../models/user'
import { body, validationResult } from 'express-validator'
import sequelize from '../config/database'
import bcrypt from 'bcryptjs'
import jwt, { Secret } from 'jsonwebtoken'
import { IToken, ITokenPayload, IUser } from '../types'

const generateToken = async (id: string | undefined): Promise<string | undefined> => {
  if (!id) return undefined

  const secret: Secret = process.env.JWT_SECRET || 'sfj0ker8GJ3RT3s5djdf23'
  const options = { expiresIn: '1d' }
  try {
    const token = (await new Promise<string | undefined>((resolve, reject) => {
      jwt.sign({ userId: id }, secret, options, (err, token) => {
        if (err) {
          console.error(err)
          reject(undefined)
        } else {
          resolve(token)
        }
      })
    })) as IToken['token']
    return token
  } catch (error) {
    console.error('Virhe tokenin generoinnissa:', error)
    return undefined
  }
}

const verifyToken = (token: string) => {
  const secret: Secret = process.env.JWT_SECRET || 'sfj0ker8GJ3RT3s5djdf23'

  return jwt.verify(token, secret) as ITokenPayload
}

const verifyTokenMiddleware = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1] as IToken['token']
    if (!token)
      throw new Error('Virhe: pyynnössä ei ole mukana tokenia. Kirjaudu sisään.')
    const decoded = verifyToken(token)
    if (!decoded) throw new Error('Virhe, kirjaudu uudestaan sisään')
    const user: IUser | null = await User.findOne({ where: { _id: decoded?.userId } })
    if (!user) throw new Error('Käyttäjää ei löytynyt')
    res.status(200).json({
      message: 'Token verifioitu.',
    })
  } catch (error) {
    console.error('Error:', error)
    res
      .status(500)
      .json({ success: false, message: 'Tapahtui virhe tokenin verifioinnissa.' })
  }
}

const checkIfAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] as IToken['token']
  if (!token) throw new Error('Virhe: pyynnössä ei ole mukana tokenia. Kirjaudu sisään.')
  const decoded = verifyToken(token)
  if (!decoded) throw new Error('Virhe, kirjaudu uudestaan sisään')
  const findUser: IUser | null = await User.findOne({ where: { _id: decoded?.userId } })

  if (findUser && findUser?.role && findUser?.role > 1) {
    next()
  } else {
    res.status(403).json({
      message: 'Virhe: toimenpide vaatii ylläpitäjän oikeudet.',
    })
  }
}

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: IUser[] = await User.findAll()
    res.status(200).json(users)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Tapahtui virhe ^' })
  }
}

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user: IUser | null = await User.findOne({ where: { _id: req.params._id } })
    res.status(200).json(user)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Tapahtui virhe *' })
  }
}

const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Pick<IUser, 'name' | 'username' | 'password' | 'role'>

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = await User.create({
      name: body.name,
      username: body.username,
      password: passwordHash,
      role: body.role,
    })

    const allUsers: IUser[] = await User.findAll()

    res.status(201).json({
      success: true,
      message: 'Käyttäjä lisätty.',
      user: {
        id: user.id,
        _id: user._id,
        name: user.name,
        username: user.username,
        password: passwordHash,
      },
      users: allUsers,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Tapahtui virhe ¤' })
  }
}

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { password, name } = req.body
    const user = await User.findOne({ where: { _id: id } })

    if (user) {
      if (name) {
        const existingName = await User.findOne({ where: { name } })
        if (existingName && existingName._id !== user._id) {
          res.status(400).json({
            success: false,
            message: 'Nimi ei ole vapaana. Valitse toinen nimi.',
          })
          return
        }
        user.name = name
      }
      if (password) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
          const salt = await bcrypt.genSalt(10)
          const hashedPassword = await bcrypt.hash(password, salt)
          user.password = hashedPassword
        }
        const updatedUser = await user.save()
        res.status(200).json({
          success: true,
          message: `Käyttäjä päivitetty! ¤`,
          user: {
            id: user.id,
            _id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            role: updatedUser.role,
          },
        })
        return
      }
      const updatedUser: IUser = await user.save()
      res.status(200).json({
        success: true,
        message: `Käyttäjä päivitetty!`,
        user: {
          id: user.id,
          _id: updatedUser._id,
          name: updatedUser.name,
          username: updatedUser.username,
          role: updatedUser.role,
        },
      })
      return
    } else {
      res.status(404).json({
        success: false,
        message: 'Tapahtui virhe *',
      })
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({
      success: false,
      message: `Tapahtui virhe ¤`,
      error,
    })
  }
}

const updateUsername = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const { username } = req.body

  const user = await User.findOne({ where: { _id: id } })

  if (user) {
    if (username) {
      const existingUsername = await User.findOne({ where: { username } })
      if (existingUsername && existingUsername._id !== user._id) {
        res.status(400).json({
          success: false,
          message: 'Käyttäjätunnus ei ole vapaana. Valitse toinen käyttäjätunnus.',
        })
        return
      }
      user.username = username
    }

    const updatedUser: IUser = await user.save()
    res.status(200).json({
      success: true,
      message: `Käyttäjä päivitetty!`,
      user: {
        id: user.id,
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        role: updatedUser.role,
      },
    })
    return
  } else {
    res.status(404).json({
      success: false,
      message: 'Tapahtui virhe ^',
    })
  }
}

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const user = await User.findOne({ where: { _id: id } })

    if (user) {
      if (user.id === 7) {
        res.status(400).json({
          success: false,
          message: 'Et voi poistaa tätä käyttäjää.',
        })
        return
      }
      // Find all Palvelu and Kategoria instances that were last edited by the user
      const palvelut = await Palvelu.findAll({ where: { viimeisinMuokkaus: id } })
      const kategoriat = await Kategoria.findAll({ where: { viimeisinMuokkaus: id } })
      const esittelyt = await Esittely.findAll({ where: { viimeisinMuokkaus: id } }) // New

      // Update the viimeisinMuokkaus field to 7
      for (const palvelu of palvelut) {
        palvelu.viimeisinMuokkaus = 7
        await palvelu.save()
      }
      for (const kategoria of kategoriat) {
        kategoria.viimeisinMuokkaus = 7
        await kategoria.save()
      }
      for (const esittely of esittelyt) {
        // New
        esittely.viimeisinMuokkaus = 7
        await esittely.save()
      }

      await user.destroy()
      res.status(200).json({
        success: true,
        message: 'Käyttäjä poistettu',
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Käyttäjää ei löytynyt',
      })
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({
      success: false,
      message: 'Virhe käyttäjän poistamisessa',
      error,
    })
  }
}

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token)
      throw new Error('Virhe: pyynnössä ei ole mukana tokenia. Kirjaudu sisään.')

    const decoded = verifyToken(token)

    if (!decoded) throw new Error('Virhe, kirjaudu uudestaan sisään')
    const user: IUser | null = await User.findOne({ where: { _id: decoded?.userId } })

    if (!user) throw new Error('Virhe: Autentikointi epäonnistui.')

    // Attach user information to the request object
    req.body.user = user
    next()
  } catch (error) {
    console.error('Error:', error)
    res.status(401).json({ success: false, message: 'Autentikointi epäonnistui' })
  }
}

const comparePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const comparePassword = async function (
    this: IUser,
    candidatePassword: string
  ): Promise<boolean> {
    try {
      const isMatch: boolean = await bcrypt.compare(candidatePassword, this.password!)
      return isMatch
    } catch (error) {
      console.error('Virhe:', error)
      return false
    }
  }
  try {
    const { _id, passwordOld } = req.body
    const user: IUser | null = await User.findOne({ where: { _id } })

    if (!user) {
      res.status(404).json({ success: false, message: 'Käyttäjää ei löydy. ~' })
      return
    }
    if (user) {
      const passwordMatch: boolean = await comparePassword.call(user, passwordOld)

      if (passwordMatch) {
        next()
      } else {
        res.status(401).json({
          success: false,
          message: `Virhe: väärä salasana`,
        })
      }
    }
  } catch (error) {
    console.error('Error:', error)
    res
      .status(500)
      .json({ success: false, message: 'Tapahtui virhe salasanan vertailussa' })
  }
}

const loginUser = async (req: Request, res: Response): Promise<void> => {
  const comparePassword = async function (
    this: IUser,
    candidatePassword: string
  ): Promise<boolean> {
    try {
      const isMatch: boolean = await bcrypt.compare(candidatePassword, this.password!)
      return isMatch
    } catch (error) {
      console.error('Virhe:', error)
      return false
    }
  }
  try {
    const { username, password } = req.body
    const user: IUser | null = await User.findOne({ where: { username: username } })

    if (!user) {
      res.status(401).json({
        message: `Väärä salasana tai käyttäjätunnus`,
      })
    } else {
      const passwordMatch: boolean = await comparePassword.call(user, password)
      if (passwordMatch) {
        const token = await generateToken(user._id)

        res.status(200).json({
          success: true,
          message: 'Kirjauduttu sisään',
          user: {
            id: user.id,
            _id: user._id,
            name: user.name,
            username: user.username,
            role: user.role,
          },
          token,
        })
      }
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Virhe kirjautumisessa',
    })
  }
}

const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Jarjestys.findAll()
    res.status(200).json(order)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Tapahtui virhe!',
      error,
    })
    console.error('Virhe:', error)
  }
}

const addOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Jarjestys.create(req.body)
    res.status(200).json(order)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Tapahtui virhe!',
      error,
    })
    console.error('Virhe:', error)
  }
}

const updateOrder = async (req: Request, res: Response): Promise<void> => {
  const { jarjestys } = req.body

  try {
    await sequelize.transaction(async (transaction) => {
      for (const j of jarjestys) {
        await Jarjestys.update(
          { jarjestys: j.jarjestys },
          { where: { palveluId: j.palveluId }, transaction }
        )
      }
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error })
  }
}
// const transaction = await sequelize.transaction()
// try {
//   const newOrder = req.body // an array of IDs in the new order

//   for (let i = 0; i < newOrder.length; i++) {
//     await Jarjestys.update(
//       { jarjestys: i },
//       { where: { id: newOrder[i] }, transaction }
//     )
//   }

//   await transaction.commit()

//   res.status(200).json({ success: true, message: 'Järjestys päivitetty.' })
// } catch (error) {
//   await transaction.rollback()

//   res.status(500).json({
//     success: false,
//     message: 'An error occurred while updating the order.',
//     error,
//   })
//   console.error('Error:', error)
// }
// }

const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Jarjestys.destroy({
      where: {
        _id: req.params._id,
      },
    })
    if (!order) {
      res.status(404).json({ success: false, message: 'Järjestystä ei löytynyt.' })
      return
    }
    res.status(200).json(order)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Tapahtui virhe!',
      error,
    })
    console.error('Virhe:', error)
  }
}

const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch the categories in the specified order
    const categories = await Kategoria.findAll({
      order: [['orderIndex', 'ASC']],
    })
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kategorioiden haussa tapahtui virhe.',
      error,
    })
    console.error('Virhe:', error)
  }
}

const addCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find the highest current orderIndex
    const maxOrderIndex: number = await Kategoria.max('orderIndex')

    // Add the new category with an orderIndex one more than the highest current orderIndex
    const category = await Kategoria.create({
      ...req.body,
      orderIndex: maxOrderIndex + 1,
    })

    res.status(200).json(category)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Tapahtui virhe!',
      error,
    })
    console.error('Virhe:', error)
  }
}

const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Kategoria.update(req.body, {
      where: {
        _id: req.params._id,
      },
    })
    if (!category) {
      res.status(404).json({ success: false, message: 'Kategoriaa ei löytynyt.' })
      return
    }
    res.status(200).json(category)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Tapahtui virhe!',
      error,
    })
    console.error('Virhe:', error)
  }
}

const getCategoryOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Kategoria.findAll({
      order: [['orderIndex', 'ASC']],
    })
    const order = categories.map((category) => category.id)

    res.status(200).json(order)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Virhe kategorioiden hakemisessa',
      error,
    })
    console.error('Virhe:', error)
  }
}

const updateCategoryOrder = async (req: Request, res: Response): Promise<void> => {
  let { order } = req.body

  if (!Array.isArray(order)) {
    res.status(400).json({
      success: false,
      message: 'Järjestyksen on oltava taulukko kategoria-ID:tä.',
    })
    return
  }

  const maxAttempts = 5
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const transaction = await sequelize.transaction()

    try {
      for (let i = 0; i < order.length; i++) {
        await Kategoria.update(
          { orderIndex: i },
          { where: { id: order[i] }, transaction }
        )
      }

      await transaction.commit()

      res.status(200).json({ success: true })
      return
    } catch (error) {
      try {
        await transaction.rollback()
      } catch (error) {
        if (
          (error as any).name === 'SequelizeDatabaseError' &&
          (error as any).parent.errno === 1213
        ) {
          // If a deadlock occurred, retry the transaction
          continue
        }
      }
      res.status(500).json({
        success: false,
        message: 'Virhe kategorioiden järjestyksen päivittämisessä.',
        error,
      })
      console.error('Error:', error)
      return
    }
  }
}

const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Kategoria.destroy({
      where: {
        id: req.params.id,
      },
    })
    if (!category) {
      res.status(404).json({ success: false, message: 'Kategoriaa ei löytynyt.' })
      return
    }
    res.status(200).json(category)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Tapahtui virhe!',
      error,
    })
    console.error('Virhe:', error)
  }
}

const getIntro = async (req: Request, res: Response): Promise<void> => {
  try {
    const intro = await Esittely.findAll()
    res.status(200).json(intro)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Tapahtui virhe!',
      error,
    })
    console.error('Virhe:', error)
  }
}

const addOrEditIntro = async (req: Request, res: Response): Promise<void> => {
  try {
    const intro = await Esittely.findOne()
    if (intro) {
      const updatedIntro = await Esittely.update(req.body, {
        where: {
          id: intro.id,
        },
      })
      res.status(200).json(updatedIntro)
    } else {
      const newIntro = await Esittely.create(req.body)
      res.status(200).json(newIntro)
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Tapahtui virhe!',
      error,
    })
    console.error('Virhe:', error)
  }
}

const deleteIntro = async (req: Request, res: Response): Promise<void> => {
  try {
    const intro = await Esittely.destroy({
      where: {
        id: req.params.id,
      },
    })
    if (!intro) {
      res.status(404).json({ success: false, message: 'Esittelyä ei löytynyt.' })
      return
    }
    res.status(200).json(intro)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Tapahtui virhe!',
      error,
    })
    console.error('Virhe:', error)
  }
}

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await Palvelu.findAll({
      include: [
        {
          model: Jarjestys,
          as: 'jarjestys',
        },
      ],
      order: [[sequelize.col('jarjestys.jarjestys'), 'ASC']],
    })
    res.status(200).json(services)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Tapahtui virhe! #',
      error,
    })
    console.error('Virhe:', error)
  }
}

const getServiceByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Palvelu.findAll({
      where: {
        nimi: {
          [Op.like]: `%${req.params.name}%`,
        },
      },
    })
    if (!service) {
      res
        .status(404)
        .json({ success: false, message: 'Palvelua ei löytynyt tällä nimellä.' })
      return
    }
    res.status(200).json(service)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Tapahtui virhe! *',
      error,
    })
    console.error('Virhe:', error)
  }
}

const addService = [
  authenticateUser,
  // Validate fields.
  body('nimi').isLength({ min: 1 }).trim().withMessage('Palvelu tarvitsee nimen.'),
  body('hinta').isNumeric().withMessage('Hinnan on oltava numero.'),

  // Process request after validation and sanitization.
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.status(400).json({ errors: errors.array() })
      return
    }

    try {
      // Start a new transaction
      const result = await sequelize.transaction(async (transaction) => {
        // Increment the jarjestys of all existing Jarjestys
        await Jarjestys.increment('jarjestys', { by: 1, where: {}, transaction })

        // Create a new Palvelu
        const newService = await Palvelu.create(req.body, { transaction })

        // Create a new Jarjestys for the new Palvelu with jarjestys set to 1
        const newOrder = await Jarjestys.create(
          { palveluId: newService.id, jarjestys: 1 },
          { transaction }
        )

        return { newService, newOrder }
      })

      res.status(200).json(result)
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Tapahtui virhe! -',
        error,
      })
      console.error('Virhe:', error)
    }
  },
]

const updateService = [
  authenticateUser,
  // Validate fields.
  body('nimi').isLength({ min: 1 }).trim().withMessage('Palvelu tarvitsee nimen.'),
  body('hinta').isNumeric().withMessage('Hinnan on oltava numero.'),

  // Process request after validation and sanitization.
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.status(400).json({ errors: errors.array() })
      return
    }

    try {
      const service = await Palvelu.update(req.body, {
        where: {
          id: req.params.id,
        },
      })
      if (!service) {
        res.status(404).json({ success: false, message: 'Palvelua ei löytynyt.' })
        return
      }
      res.status(200).json(service)
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Tapahtui virhe! ^',
        error,
      })
      console.error('Virhe:', error)
    }
  },
]

const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    await Jarjestys.destroy({ where: { palveluId: id } })
    const service = await Palvelu.destroy({
      where: {
        id: req.params.id,
      },
    })
    if (!service) {
      res.status(404).json({ success: false, message: 'Palvelua ei löytynyt.' })
      return
    }
    res.status(200).json(service)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Tapahtui virhe! ~',
      error,
    })
    console.error('Virhe:', error)
  }
}

const searchPriceRange = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await Palvelu.findAll({
      where: {
        hinta: {
          [Op.between]: [req.params.min, req.params.max],
        },
      },
    })
    if (!services) {
      res.status(404).json({ success: false, message: 'Palvelua ei löytynyt.' })
      return
    }
    res.status(200).json(services)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Tapahtui virhe! ¤',
      error,
    })
    console.error('Virhe:', error)
  }
}

export {
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
  comparePassword,
  loginUser,
}

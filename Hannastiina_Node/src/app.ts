import express, { Express } from 'express'
import cors from 'cors'
import routes from './routes'
import path from 'path'
import { Sequelize } from 'sequelize'
import './models/palvelu'
import './models/jarjestys'
import './models/associations'

require('dotenv').config()

const app: Express = express()

const PORT: string | number = process.env.PORT ?? 4000

const sequelize = new Sequelize(
  `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:3306/${process.env.DB_NAME}`
)

// const sequelize = new Sequelize(
//   process.env.DB_NAME ?? '',
//   process.env.DB_USER ?? '',
//   process.env.DB_PASSWORD ?? '',
//   {
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//     logging: true, // true for debugging
//   }
// )

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
    return sequelize.sync({ force: true })
  })
  .then(() => {
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true })) // Middleware to parse URL-encoded form data
    app.use('/api/', routes)

    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, 'dist')))

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'))
    })

    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error)
  })

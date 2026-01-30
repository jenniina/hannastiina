import express, { Express } from 'express'
import cors from 'cors'
import routes from './routes'
import path from 'path'
import fs from 'fs'
import { Sequelize } from 'sequelize'
import './models/palvelu'
import './models/jarjestys'
import './models/associations'
import { mongoSanitize } from './middleware/mongoSanitize'
import { rateLimit } from './middleware/rateLimit'

require('dotenv').config()

const app: Express = express()

app.disable('x-powered-by')

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
    const forceSync = process.env.DB_SYNC_FORCE === 'true'
    return sequelize.sync({ force: forceSync })
  })
  .then(() => {
    app.use(cors())
    app.use(express.json({ limit: '1mb' }))
    app.use(express.urlencoded({ extended: true, limit: '1mb' })) // Middleware to parse URL-encoded form data
    app.use(mongoSanitize())

    // Basic API rate limiting (login gets a stricter limiter at the route level).
    app.use(
      '/api/',
      rateLimit({
        windowMs: 60_000,
        max: 300,
        message: 'Liikaa pyyntöjä, yritä pian uudelleen.',
      })
    )
    app.use('/api/', routes)

    // Serve Vike client output (prerendered HTML lives under dist/client/<path>/index.html)
    const distClientPath = path.join(__dirname, 'dist', 'client')
    app.use(express.static(distClientPath))

    // Catch-all: prefer prerendered HTML if it exists, else fallback to SPA index.
    app.get('*', (req, res) => {
      const urlPath = req.path.replace(/^\/+/, '').replace(/\/+$/, '')
      const prerenderedHtmlPath = path.join(
        distClientPath,
        urlPath,
        'index.html'
      )

      if (fs.existsSync(prerenderedHtmlPath)) {
        res.sendFile(prerenderedHtmlPath)
        return
      }

      res.sendFile(path.join(distClientPath, 'index.html'))
    })

    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error)
  })

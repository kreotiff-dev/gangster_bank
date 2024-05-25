require('dotenv').config()
const express = require('express')
const pool = require('./dbConfig')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./routing/index')
const logger = require('./utils/logger')
const PORT = process.env.PORT || 3000
const app = express()
const errorMiddleware = require('./middlewares/error-middleware')


// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors())
app.use('/api', router)
app.use(errorMiddleware)

// Запуск сервера
const start = async () => {
    try {
        pool.query('SELECT NOW()', (err, res) => {
            if (err) {
                logger.error(`Error connecting to db ${err}`)
            } else {
                logger.info(`Current time from database: ${res.rows[0].now}`) //для проверки подключения к бд
                app.listen(PORT, () => logger.info(`Server started on port = ${PORT}`))
            }
        });
    } catch (e) {
        logger.info(`Error starting the server: ${e}`)
    }
  }

  start()
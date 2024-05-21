require('dotenv').config()
const express = require('express')
const pool = require('./dbConfig')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./routing/index')
const PORT = process.env.PORT || 3000
const app = express()
const errorMiddleware = require('./middlewares/error-middleware')


// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api', router)
app.use(errorMiddleware)

// Запуск сервера
const start = async () => {
    try {
        pool.query('SELECT NOW()', (err, res) => {
            if (err) {
                console.error('Error connecting to db', err)
            } else {
                console.log('Current time from database:', res.rows[0].now) //для проверки подключения к бд
                app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
            }
        });
    } catch (e) {
      console.log('Error starting the server:', e)
    }
  }

  start()
require('dotenv').config();
const config = require('./config/config') 
const express = require('express');
const { sequelize } = require('./models');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routing/index');
const logger = require('./utils/logger');
const PORT = process.env.PORT || 3000;
const app = express();
const errorMiddleware = require('./middlewares/error-middleware');
const { connectRedis } = require('./config/redisClient');

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: config.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use('/api', router);
app.use(errorMiddleware);

// Запуск сервера
const start = async () => {
    try {
        // Проверка подключения к базе данных с использованием Sequelize
        await sequelize.authenticate();
        logger.info('Connection has been established successfully.');

        // Синхронизация моделей с базой данных
        await sequelize.sync();

        // Подключение к Redis
        await connectRedis();

        // Запуск сервера
        app.listen(PORT, () => {
            logger.info(`Server started on port ${PORT}`);
        });
    } catch (e) {
        logger.error(`Error starting the server: ${e.message}`);
    }
};

start();

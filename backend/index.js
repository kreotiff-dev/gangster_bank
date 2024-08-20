require('dotenv').config();
const config = require('./config/config');
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
const rabbitMQService = require('./service/rabbitmq-service');
const rabbitMQUtils = require('./utils/rabbitmq');

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
        await sequelize.authenticate();
        logger.info('Connection has been established successfully.');

        await sequelize.sync();

        await connectRedis();

        // Подключение к RabbitMQ
        await rabbitMQUtils.connect();
        logger.info('Connected to RabbitMQ via utils');

        // Запускаем слушатель очереди
        rabbitMQService;

        app.listen(PORT, () => {
            logger.info(`Server started on port ${PORT}`);
        });
    } catch (e) {
        logger.error(`Error starting the server: ${e.message}`);
    }
};

process.on('exit', async () => {
    await rabbitMQUtils.closeConnection();
});

start();

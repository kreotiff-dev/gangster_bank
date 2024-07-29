const ApiError = require('../exceptions/api-error');
const logger = require('../utils/logger');

// Middleware для обработки ошибок
module.exports = function (err, req, res, next) {
    logger.error(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${err.message}`);

    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }

    if (err.name === 'MongoError' || err.name === 'SequelizeDatabaseError') {
        return res.status(500).json({ message: 'Ошибка базы данных', error: err.message });
    }

    return res.status(500).json({ message: 'Непредвиденная ошибка', error: err.message });
};

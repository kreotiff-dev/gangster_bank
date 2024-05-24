const ApiError = require('../exceptions/api-error');

// Middleware для обработки ошибок
module.exports = function (err, req, res, next) {
    // Логирование ошибки с дополнительной информацией
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${err.message}`);
    
    if (err instanceof ApiError) {
        // Обработка ошибок ApiError
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }

    // Обработка ошибок базы данных (например, MongoDB или PostgreSQL)
    if (err.name === 'MongoError' || err.name === 'SequelizeDatabaseError') {
        return res.status(500).json({ message: 'Ошибка базы данных', error: err.message });
    }

    // Обработка остальных ошибок
    return res.status(500).json({ message: 'Непредвиденная ошибка', error: err.message });
};

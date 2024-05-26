const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');
const logger = require('../utils/logger');

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        
        if (!authorizationHeader) {
            logger.error('Authorization header missing');
            return next(ApiError.UnauthError()); // Возвращаем ошибку, если заголовок отсутствует
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            logger.error('Access token missing');
            return next(ApiError.UnauthError()); // Возвращаем ошибку, если токен отсутствует
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            logger.error('Invalid access token');
            return next(ApiError.UnauthError()); // Возвращаем ошибку, если токен невалиден
        }

        req.user = userData;
        next(); // Переход к следующему middleware или маршруту
    } catch (e) {
        logger.error(`Error in auth middleware: ${e.message}`);
        return next(ApiError.UnauthError()); // Возвращаем ошибку при возникновении исключения
    }
};

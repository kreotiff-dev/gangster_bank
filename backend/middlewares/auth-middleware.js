const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');
const { connectRedis } = require('../config/redisClient');
const logger = require('../utils/logger');

module.exports = async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        
        if (!authorizationHeader) {
            logger.error('Authorization header missing');
            return next(ApiError.UnauthError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            logger.error('Access token missing');
            return next(ApiError.UnauthError());
        }

        const client = await connectRedis();

        const isBlacklisted = await client.get(`blacklist_${accessToken}`);
        if (isBlacklisted) {
            return next(ApiError.UnauthError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            logger.error('Invalid access token');
            return next(ApiError.UnauthError());
        }

        req.user = userData;
        next(); 
    } catch (e) {
        logger.error(`Error in auth middleware: ${e.message}`);
        return next(ApiError.UnauthError());
    }
};

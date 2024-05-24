const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            console.error('Authorization header missing');
            return next(ApiError.UnauthError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            console.error('Access token missing');
            return next(ApiError.UnauthError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            console.error('Invalid access token');
            return next(ApiError.UnauthError());
        }

        req.user = userData;
        next();
    } catch (e) {
        console.error('Error in auth middleware:', e);
        return next(ApiError.UnauthError());
    }
};

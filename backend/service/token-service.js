const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');
const UserModel = require('../models/user-model');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const logger = require('../utils/logger');

class TokenService {
    generateTokens(payload) {
        logger.info(`Generating tokens for user ID: ${payload.id}`);
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return { accessToken, refreshToken };
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            logger.info(`Access token validated for user ID: ${userData.id}`);
            return userData;
        } catch (e) {
            logger.error(`Error validating access token: ${e.message}`);
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            logger.info(`Refresh token validated for user ID: ${userData.id}`);
            return userData;
        } catch (e) {
            logger.error(`Error validating refresh token: ${e.message}`);
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        try {
            const tokenData = await tokenModel.getTokenByUserId(userId);
            logger.info(`Saving refresh token for user ID: ${userId}`);
            if (tokenData.length > 0) {
                const updatedToken = await tokenModel.updateToken(userId, refreshToken);
                logger.info(`Updated refresh token for user ID: ${userId}`);
                return updatedToken;
            } else {
                const token = await tokenModel.createToken(userId, refreshToken);
                logger.info(`Created new refresh token for user ID: ${userId}`);
                return token;
            }
        } catch (e) {
            logger.error(`Error saving token: ${e.message}`);
            throw e;
        }
    }

    async removeToken(refreshToken) {
        try {
            const tokenData = await tokenModel.deleteTokenByRefreshToken(refreshToken);
            logger.info('Refresh token removed');
            return tokenData;
        } catch (e) {
            logger.error(`Error removing token: ${e.message}`);
            throw e;
        }
    }

    async findToken(refreshToken) {
        try {
            const tokenData = await tokenModel.findTokenByRefreshToken(refreshToken);
            logger.info('Refresh token found');
            return tokenData;
        } catch (e) {
            logger.error(`Error finding token: ${e.message}`);
            throw e;
        }
    }

    async refreshTokens(refreshToken) {
        try {
            logger.info('Refreshing tokens for provided refresh token');
            const userData = this.validateRefreshToken(refreshToken);
            if (!userData) {
                throw ApiError.UnauthError();
            }
            const tokenFromDb = await this.findToken(refreshToken);
            if (!tokenFromDb) {
                throw ApiError.UnauthError();
            }
            const user = await UserModel.getUserById(userData.id);
            const userDto = new UserDto(user);
            const tokens = this.generateTokens({ ...userDto });
            await this.saveToken(userData.id, tokens.refreshToken);
            logger.info(`Tokens refreshed for user ID: ${userData.id}`);
            return { ...tokens, user: userDto };
        } catch (e) {
            logger.error(`Error refreshing tokens: ${e.message}`);
            throw e;
        }
    }
}

module.exports = new TokenService();

const { User } = require('../models');
const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const logger = require('../utils/logger');

class AuthService {
    async login(phone, password) {
        logger.info(`Logging in user with phone: ${phone}`);
        const user = await User.findOne({ where: { phone } });
        if (!user) {
            throw ApiError.BadRequest(`User with ${phone} not found`);
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest(`Password wrong`);
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async logout(refreshToken) {
        logger.info(`Logging out user with refresh token: ${refreshToken}`);
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        logger.info(`Refreshing tokens with refresh token: ${refreshToken}`);
        if (!refreshToken) {
            throw ApiError.UnauthError();
        }
        const tokens = await tokenService.refreshTokens(refreshToken);
        return tokens;
    }
}

module.exports = new AuthService();

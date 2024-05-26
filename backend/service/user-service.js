const { User } = require('../models');
const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const logger = require('../utils/logger');

class UserService {
    async registration(phone, email, password, first_name, last_name) {
        logger.info(`Registering user: ${phone}, ${email}`);
        const candidate = await User.findOne({ where: { phone } });
        if (candidate) {
            throw ApiError.BadRequest(`User with this phone ${phone} already exists`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const user = await User.create({ phone, email, password: hashPassword, first_name, last_name });
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        console.log('Generated tokens in userService:', tokens); // Debugging line
        console.log('Passing to saveToken:', userDto.id, tokens.refreshToken); // Debugging line

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async confirmationCheck(code, phone) {
        logger.info(`Checking confirmation code for phone: ${phone}`);
        const user = await User.findOne({ where: { phone } });
        if (!user) {
            return false;
        }
        if (user.confirm_code === code) {
            user.confirmed = true;
            await user.save();
            return true;
        } else {
            return false;
        }
    }

    async refresh(refreshToken) {
        logger.info(`Refreshing tokens with refresh token: ${refreshToken}`);
        if (!refreshToken) {
          throw ApiError.UnauthError();
        }
        const tokens = await tokenService.refreshTokens(refreshToken); // Используйте camelCase
        return tokens;
      }
    
      async logout(refreshToken) {
        logger.info(`Logging out user with refresh token: ${refreshToken}`);
        if (!refreshToken) {
          throw ApiError.UnauthError();
        }
        const token = await tokenService.removeToken(refreshToken);
        return token;
      }

    async getAllUsers() {
        logger.info('Getting all users');
        const users = await User.findAll();
        return users;
    }

    async getUserById(userId) {
        logger.info(`Getting user by ID: ${user_id}`);
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.BadRequest(`User with id ${user_id} not found`);
        }
        return user;
    }
}

module.exports = new UserService();

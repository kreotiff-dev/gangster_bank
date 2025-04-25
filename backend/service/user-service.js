const { User } = require('../models');
const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const logger = require('../utils/logger');

class UserService {
    async registration(phone, email, password, firstName, lastName) {
        logger.info(`Registering user: ${phone}, ${email}`);
        const candidate = await User.findOne({ where: { phone } });
        if (candidate) {
            throw ApiError.BadRequest(`User with this phone ${phone} already exists`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const user = await User.create({ phone, email, password: hashPassword, firstName, lastName });
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        console.log('Generated tokens in userService:', tokens);
        console.log('Passing to saveToken:', userDto.id, tokens.refreshToken);

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async confirmationCheck(code, phone) {
        logger.info(`Checking confirmation code for phone: ${phone}`);
        const user = await User.findOne({ where: { phone } });
        console.log('Содержимое user', user)
        if (!user) {
            return false;
        }
        if (user.confirmCode === code) {
            user.confirmed = true;
            await user.save();
            return true;
        } else {
            return false;
        }
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
          throw ApiError.UnauthError();
        }
        const tokens = await tokenService.refreshTokens(refreshToken); 
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
        logger.info(`Getting user by ID: ${userId}`);
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.BadRequest(`User with id ${userId} not found`);
        }
        return user;
    }
}

module.exports = new UserService();

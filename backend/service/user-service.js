const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration(phone, email, password) {
        const candidate = await UserModel.getUserByPhone({phone})
        if (candidate) {
            throw ApiError.BadRequest(`User with this email ${phone} `)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const user = await UserModel.createUser({phone, email, password: hashPassword})
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }
    async confirmationCheck(code, phone) {
        const user = await UserModel.getUserByPhone(phone)
        if (!user) {
            return false
        }
        if (user.confirmcode === code) {
            await UserModel.confirm(phone)
            return true
        } else {
            return false
        }
    }
    async login(phone, password) {
        const user = await UserModel.getUserByPhone(phone)
        if (!user)  {
            throw ApiError.BadRequest(`User with ${phone} не найден`)
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest(`Password wrong`)
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthError();
        }
        const user = await UserModel.getUserById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.getUsers()
        return users
    }

    async getUserById(userId) {
        const user = await UserModel.getUserById(userId);
        if (!user) {
            throw ApiError.BadRequest(`User with id ${userId} not found`);
        }
        return user;
    }

}

module.exports = new UserService()
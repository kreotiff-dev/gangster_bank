const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')

class UserService {
    async registration(phone, email, password) {
        const candidate = await UserModel.getUserByPhone({phone})
        if (candidate) {
            throw new Error(`User with this email ${phone} `)
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

}

module.exports = new UserService()
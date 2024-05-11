const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token-model')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn:'30m'})

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn:'30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.getTokenByUserId(userId)
        console.log('Token Data:', tokenData);
        if (tokenData.length > 0) {
            const updatedToken = await tokenModel.updateToken(userId, refreshToken);
            tokenData.refreshToken = refreshToken;
            return updatedToken
        } else {
        const token = await tokenModel.createToken(userId, refreshToken)
        return token
        }
    }

}

module.exports = new TokenService()
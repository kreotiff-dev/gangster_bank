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

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
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

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteTokenByRefreshToken(refreshToken)
        return tokenData
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findTokenByRefreshToken(refreshToken)
        return tokenData;
    }

}

module.exports = new TokenService()
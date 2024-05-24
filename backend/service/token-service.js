const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');
const UserModel = require('../models/user-model');
const UserDto = require('../dtos/user-dto');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return { accessToken, refreshToken };
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            console.error('Error validating access token:', e);
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            console.error('Error validating refresh token:', e);
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        try {
            const tokenData = await tokenModel.getTokenByUserId(userId);
            if (tokenData.length > 0) {
                const updatedToken = await tokenModel.updateToken(userId, refreshToken);
                tokenData.refreshToken = refreshToken;
                return updatedToken;
            } else {
                const token = await tokenModel.createToken(userId, refreshToken);
                return token;
            }
        } catch (e) {
            console.error('Error saving token:', e);
            throw e;
        }
    }

    async removeToken(refreshToken) {
        try { 
            const tokenData = await tokenModel.deleteTokenByRefreshToken(refreshToken);
            return tokenData;
        } catch (e) {
            console.error('Error removing token:', e);
            throw e;
            }
    }

    async findToken(refreshToken) {
        try {
            const tokenData = await tokenModel.findTokenByRefreshToken(refreshToken);
            return tokenData;
        } catch (e) {
            console.error('Error finding token:', e);
            throw e;
        }
    }

    async refreshTokens(refreshToken) {
        try {
            const userData = this.validateRefreshToken(refreshToken);
            const tokenFromDb = await this.findToken(refreshToken);
            if (!userData || !tokenFromDb) {
                throw ApiError.UnauthError();
            }
            const user = await UserModel.getUserById(userData.id);
            const userDto = new UserDto(user);
            const tokens = this.generateTokens({ ...userDto });
            
            await this.saveToken(userData.id, tokens.refreshToken);
            return { ...tokens, user: userDto };
        } catch (e) {
            console.error('Error refreshing tokens:', e);
            throw e;
        }
    }
}

module.exports = new TokenService();

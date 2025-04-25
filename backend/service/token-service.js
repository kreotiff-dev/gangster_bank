const { Token } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ApiError = require('../exceptions/api-error');
const UserDto = require('../dtos/user-dto');
const client = require('../config/redisClient');

console.log('Current environment:', process.env.NODE_ENV);
console.log('Config:', config);

class TokenService {
  generateTokens(payload) {
    console.log('Generating tokens with payload:', payload);
    console.log('JWT_ACCESS_SECRET:', config.JWT_ACCESS_SECRET);
    console.log('JWT_REFRESH_SECRET:', config.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: '30d' });

    console.log('Generated accessToken:', accessToken); 
    console.log('Generated refreshToken:', refreshToken);
    
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId, refreshToken) {
    console.log('Saving token for user:', userId);
    console.log('Refresh token:', refreshToken);

    if (!refreshToken) {
        throw new Error('refresh_token is undefined'); 
      }

    const tokenData = await Token.findOne({ where: { userId } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await Token.create({ userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.destroy({ where: { refreshToken } });
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await Token.findOne({ where: { refreshToken } });
    return tokenData;
  }

  validateAccessToken(token) {
    console.log("Validating access token:", token)
    try {
      const userData = jwt.verify(token, config.JWT_ACCESS_SECRET);
      console.log('Access token valid:', userData); 
      return userData;
    } catch (e) {
      console.error('Access token validation error:', e); 
      return null;
    }
  }

  validateRefreshToken(token) {
    console.log('Validating refresh token:', token); 
    try {
      const userData = jwt.verify(token, config.JWT_REFRESH_SECRET);
      console.log('Refresh token valid:', userData); 
      return userData;
    } catch (e) {
      console.log('Refresh token validation error:', e); 
      return null;
    }
  }

  async refreshTokens(refreshToken) { 
    console.log('Refreshing tokens with refresh token:', refreshToken); 
    const tokenData = await this.findToken(refreshToken);
    if (!tokenData) {
      throw ApiError.UnauthError();
    }


    const userData = this.validateRefreshToken(refreshToken);
    if (!userData) {
      throw ApiError.UnauthError();
    }

    const userDto = new UserDto(userData);
    const tokens = this.generateTokens({ ...userDto });


    await this.saveToken(userDto.id, tokens.refreshToken);
    console.log('Refreshed tokens:', tokens); 

    return { ...tokens, user: userDto };
  }

  async addTokenToBlacklist(token) {
    const { exp } = jwt.decode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const ttl = exp - currentTime;

    if (ttl > 0) {
      await client.set(token, 'blacklisted', 'EX', ttl);
    }
  }

  async isTokenBlacklisted(token) {
    const result = await client.get(token);
    return result !== null;
  }
}


module.exports = new TokenService();

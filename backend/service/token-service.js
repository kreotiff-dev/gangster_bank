const { Token } = require('../models');
const jwt = require('jsonwebtoken');
const path = require('path');
const config = require(path.resolve(__dirname, '../config/config.json'))[process.env.NODE_ENV || 'development'];
const ApiError = require('../exceptions/api-error');
const UserDto = require('../dtos/user-dto');

console.log('Current environment:', process.env.NODE_ENV); // Debugging line
console.log('Config:', config); // Debugging line

class TokenService {
  generateTokens(payload) {
    console.log('Generating tokens with payload:', payload); // Debugging line
    console.log('JWT_ACCESS_SECRET:', config.JWT_ACCESS_SECRET); // Debugging line
    console.log('JWT_REFRESH_SECRET:', config.JWT_REFRESH_SECRET); // Debugging line
    const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: '30d' });

    console.log('Generated accessToken:', accessToken); // Debugging line
    console.log('Generated refreshToken:', refreshToken); // Debugging line
    
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(user_id, refresh_token) {
    console.log('Saving token for user:', user_id); // Debugging line
    console.log('Refresh token:', refresh_token); // Debugging line

    if (!refresh_token) {
        throw new Error('refresh_token is undefined'); // Debugging line to catch the issue early
      }

    const tokenData = await Token.findOne({ where: { user_id } });
    if (tokenData) {
      tokenData.refresh_token = refresh_token;
      return tokenData.save();
    }
    const token = await Token.create({ user_id, refresh_token });
    return token;
  }

  async removeToken(refresh_token) {
    const tokenData = await Token.destroy({ where: { refresh_token } });
    return tokenData;
  }

  async findToken(refresh_token) {
    const tokenData = await Token.findOne({ where: { refresh_token } });
    return tokenData;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, config.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, config.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async refreshTokens(refreshToken) { // Обновление токенов
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
    return { ...tokens, user: userDto };
  }
}


module.exports = new TokenService();

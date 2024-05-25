const pool = require('../dbConfig');
const logger = require('../utils/logger'); // Импорт логгера

class TokenModel {
    static async createToken(userId, refreshToken) {
        const query = `
            INSERT INTO user_tokens (user_id, token, created_at, updated_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *;
        `;
        const values = [userId, refreshToken];

        try {
            const result = await pool.query(query, values);
            logger.info(`Token created for user ID: ${userId}`);
            return result.rows[0];
        } catch (error) {
            logger.error(`Error creating token: ${error.message}`);
            return null;
        }
    }

    static async updateToken(userId, refreshToken) {
        const query = `
            UPDATE user_tokens
            SET token = $1, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $2
            RETURNING *;
        `;
        const values = [refreshToken, userId];

        try {
            const result = await pool.query(query, values);
            logger.info(`Token updated for user ID: ${userId}`);
            return result.rows[0];
        } catch (error) {
            logger.error(`Error updating token: ${error.message}`);
            return null;
        }
    }

    static async getTokenByUserId(userId) {
        const query = 'SELECT * FROM user_tokens WHERE user_id = $1';
        const values = [userId];

        try {
            const result = await pool.query(query, values);
            logger.info(`Token retrieved for user ID: ${userId}`);
            return result.rows;
        } catch (error) {
            logger.error(`Error getting user tokens: ${error.message}`);
            return null;
        }
    }

    static async deleteTokenByUserId(userId) {
        const query = 'DELETE FROM user_tokens WHERE user_id = $1';
        const values = [userId];

        try {
            await pool.query(query, values);
            logger.info(`Token deleted for user ID: ${userId}`);
            return true;
        } catch (error) {
            logger.error(`Error deleting user tokens: ${error.message}`);
            return false;
        }
    }

    static async deleteTokenByRefreshToken(refreshToken) {
        const query = 'DELETE FROM user_tokens WHERE token = $1';
        const values = [refreshToken];

        try {
            await pool.query(query, values);
            logger.info(`Token deleted with refresh token: ${refreshToken}`);
            return true;
        } catch (error) {
            logger.error(`Error deleting user tokens: ${error.message}`);
            return false;
        }
    }

    static async findTokenByRefreshToken(refreshToken) {
        const query = 'SELECT * FROM user_tokens WHERE token = $1';
        const values = [refreshToken];

        try {
            const result = await pool.query(query, values);
            logger.info(`Token found with refresh token: ${refreshToken}`);
            return result.rows[0];
        } catch (error) {
            logger.error(`Error finding token: ${error.message}`);
            return null;
        }
    }
}

module.exports = TokenModel;

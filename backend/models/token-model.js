const pool = require('../dbConfig');

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
            return result.rows[0];
        } catch (error) {
            console.error('Error creating token:', error);
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
            return result.rows[0];
        } catch (error) {
            console.error('Error updating token:', error);
            return null;
        }
    }

    static async getTokenByUserId(userId) {
        const query = 'SELECT * FROM user_tokens WHERE user_id = $1';
        const values = [userId];

        try {
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Error getting user tokens:', error);
            return null;
        }
    }

    static async deleteTokenByUserId(userId) {
        const query = 'DELETE FROM user_tokens WHERE user_id = $1';
        const values = [userId];

        try {
            await pool.query(query, values);
            return true;
        } catch (error) {
            console.error('Error deleting user tokens:', error);
            return false;
        }
    }
}

module.exports = TokenModel;
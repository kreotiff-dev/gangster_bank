const pool = require('../dbConfig');
const logger = require('../utils/logger'); // Импорт логгера

class UserModel {
    static async createUser(user) {
        const { phone, email, password, firstname, lastname } = user;
        const query = `
            INSERT INTO users (phone, email, password, firstname, lastname, confirmed, createdat, updatedat)
            VALUES ($1, $2, $3, $4, $5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *;
        `;
        const values = [phone, email, password, firstname, lastname];

        try {
            const result = await pool.query(query, values);
            logger.info(`User created with phone: ${phone}`);
            return result.rows[0];
        } catch (error) {
            logger.error(`Error creating user: ${error.message}`);
            return null;
        }
    }

    static async getUserById(userId) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const values = [userId];

        try {
            const result = await pool.query(query, values);
            logger.info(`User retrieved with ID: ${userId}`);
            return result.rows[0];
        } catch (error) {
            logger.error(`Error getting user by ID: ${error.message}`);
            return null;
        }
    }

    static async getUserByPhone(phone) {
        const query = 'SELECT * FROM users WHERE phone = $1';
        const values = [phone];

        try {
            const result = await pool.query(query, values);
            logger.info(`User retrieved with phone: ${phone}`);
            return result.rows[0];
        } catch (error) {
            logger.error(`Error getting user by phone: ${error.message}`);
            return null;
        }
    }

    static async confirm(phone) {
        const query = 'UPDATE users SET confirmed = true WHERE phone = $1';
        const values = [phone];

        try {
            const result = await pool.query(query, values);
            logger.info(`User confirmed with phone: ${phone}`);
            return result.rows[0];
        } catch (error) {
            logger.error(`Error confirming user: ${error.message}`);
            return null;
        }
    }

    static async getUsers() {
        const query = 'SELECT * FROM users';

        try {
            const result = await pool.query(query);
            logger.info('Retrieved all users');
            return result;
        } catch (error) {
            logger.error(`Error getting users: ${error.message}`);
            return null;
        }
    }
}

module.exports = UserModel;

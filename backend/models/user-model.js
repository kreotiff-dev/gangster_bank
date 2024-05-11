const pool = require('../dbConfig')

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
            return result.rows[0];
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    }

    static async getUserById(userId) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const values = [userId];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }

    static async getUserByPhone(phone) {
        const query = 'SELECT * FROM users WHERE phone = $1';
        const values = [phone];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }
}

module.exports = UserModel;


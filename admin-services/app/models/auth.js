const db = require('../../config/db');
class AuthModel {
    async login(username) {
        const query = 'SELECT * FROM admins WHERE username = ? AND phone_number = ? and is_active = 1 LIMIT 1';
        return await db.execute(query, [username, username]);
    }
    async createUser(data) {
        console.log(data);
        const query = 'INSERT INTO admins (slug, first_name, last_name, username, password, email, phone_number, is_active, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        return await db.execute(query, [data['slug'], data['first_name'], data['last_name'], data['username'], data['password'], data['email'], data['phone_number'], data['is_active'], data['createdAt']]);
    }

    async updateLastOnline(slug, isOnline = false) {
        const query = 'UPDATE admins SET last_online = NOW(), is_online = ' + isOnline + ' WHERE slug = ?';
        return await db.execute(query, [slug]);
    }

    async getUserByUsername(username) {
        const query = 'SELECT slug, first_name, last_name, username, password, email, phone_number,is_online, last_online, is_active FROM admins WHERE username = ? and is_active = 1 LIMIT 1';
        return await db.execute(query, [username]).then(rows => rows[0]);
    }

    async getUserByPhoneNumber(phoneNumber) {
        const query = 'SELECT * FROM admins WHERE phone_number = ? and is_active = 1 LIMIT 1';
        return await db.execute(query, [phoneNumber]);
    }
}

module.exports = new AuthModel();
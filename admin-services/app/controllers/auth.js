const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const authModel = require('../models/auth')
const {
    generateToken,
    generatePassword,
    comparePassword,
    verifyToken,
    validateHeader
} = require('../lib/utils');

class Auth {
    async login(req, res) {
        const username = req.body.username || req.query.username;
        const password = req.body.password || req.query.password;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        try {
            await authModel.getUserByUsername(username).then(async (rows) => {
                if (rows.length > 0) {
                    const row = rows[0];
                    const hashedPassword = row.password;
                    const passwordMatch = comparePassword(password, hashedPassword);
                    if (!passwordMatch) {
                        return res.status(401).json({ success: false, message: 'Invalid username or password' });
                    }

                    await authModel.updateLastOnline(row.slug, true).catch((err) => {
                        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
                    });
                    const token = generateToken(row);
                    return res.status(200).json({ success: true, message: 'Login successful', username: row.username, token: token });
                }
                return res.status(404).json({ success: false, message: 'Username not found' });
            });
        } catch (err) {
            return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
        }
    }

    async register(req, res) {
        const { firstName, lastName, password, confirmPassword, email, phoneNumber } = req.body;
        if (!firstName || !lastName || !password || !confirmPassword || !email || !phoneNumber) {
            return res.status(400).json({ success: false, message: 'fields is required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
        }
        if (!email.includes('@')) {
            return res.status(400).json({ success: false, message: 'Invalid email address' });
        }
        const username = email ? email.split('@')[0] : firstName + lastName + phoneNumber.toString().slice(-2);
        try {
            await authModel.getUserByPhoneNumber(phoneNumber).then(async (rows) => {

                if (rows[0].length > 0) {
                    return res.status(400).json({ success: false, message: 'Username already exists' });
                }

                const newPassword = await generatePassword(password);

                const data = {
                    slug: uuidv4().toString(),
                    first_name: firstName,
                    last_name: lastName,
                    username,
                    password: newPassword,
                    email,
                    phone_number: phoneNumber,
                    is_active: 1,
                    createdAt: new Date()

                };

                authModel.createUser(data).then(() => {
                    const token = generateToken(data);
                    return res.status(200).json({ success: true, message: 'Registration successful', token: token });
                }).catch((err) => {
                    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
                });
            });
            return res;
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
        }

    }

    async profile(req, res) {
        const token = validateHeader(req);
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        try {
            const decoded = verifyToken(token);
            await authModel.getUserByUsername(decoded.username).then(rows => {
                if (rows.length === 0) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }
                delete rows[0].password;
                return res.status(200).json({ success: true, message: 'User found', data: rows[0] });
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error', error: error.message })
        }
    }

    async logout(req, res) {
        const authorization = req.headers['authorization'];
        const token = authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            await authModel.updateLastOnline(decoded.slug, false).catch((err) => {
                return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
            });
            return res.status(200).json({ success: true, message: 'Logout successful' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
        }
    }
}

module.exports = new Auth();
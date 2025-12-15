const express = require('express');
const route = express.Router();
const db = require('../../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

route.post('/admin/login', (req, res) => {
    const username = req.body.username || req.query.username;
    const password = req.body.password || req.query.password;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        const query = 'SELECT * FROM admins WHERE username = ? OR email = ? LIMIT 1';

        db.execute(query, [username, username])
            .then(([rows]) => {
                if (rows.length > 0) {
                    const hashedPassword = rows[0].password;
                    const passwordMatch = bcrypt.compareSync(password, hashedPassword);
                    if (!passwordMatch) {
                        return res.status(401).json({ success: false, message: 'Invalid username or password' });
                    }

                    return res.status(200).json({ success: true, message: 'Login successful', username: rows[0].username, token: jwt.sign({ slug: rows[0].slug, username: rows[0].username, email: rows[0].email, phone_number: rows[0].phone_number }, process.env.JWT_SECRET, { expiresIn: '1d' }) });
                } else {
                    return res.status(404).json({ success: false, message: 'Username not found' });
                }
            })
            .catch((err) => {
                return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
            });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

route.post('/admin/register', (req, res) => {
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
    const username = email.split('@')[0];

    try {
        const searchUserQuery = 'SELECT * FROM admins WHERE phone_number = ? OR email = ? LIMIT 1';

        db.execute(searchUserQuery, [phoneNumber, email])
            .then(async ([rows]) => {
                if (rows.length > 0) {
                    return res.status(400).json({ success: false, message: 'Username already exists' });
                } else {
                    const slug = uuidv4().toString();
                    const newPassword = await bcrypt.hash(password, 10);
                    const query = 'INSERT INTO admins (slug,firstName, lastName, username, password, email, phone_number) VALUES (?, ?, ?, ?, ?, ?,?)';
                    db.execute(query, [slug, firstName, lastName, username, newPassword, email, phoneNumber])
                        .then(() => {
                            return res.status(200).json({ success: true, message: 'Registration successful', token: jwt.sign({ slug, username, email, phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1d' }) });
                        })
                        .catch((err) => {
                            return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
                        });
                }
            })
            .catch((err) => {
                return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
            });



    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

route.post('/admin/logout', (req, res) => {
    const authorization = req.headers['authorization'];
    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        query = 'UPDATE admins SET last_online = NOW(), is_online = 0 WHERE slug = ?';
        db.execute(query, [decoded.slug])
            .catch((err) => {
                return res.status(500).json({ message: 'Internal server error' });
            });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    return res.status(200).json({ message: 'Logout successful' });
});

route.get('/admin/profile', (req, res) => {
    const authorization = req.headers['authorization'];
    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const query = 'SELECT username, email, firstName, lastName, phone_number FROM admins WHERE slug =? LIMIT 1';
        db.execute(query, [decoded.slug])
            .then(([rows]) => {
                if (rows.length === 0) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }
                return res.status(200).json({ success: true, message: 'User found', data: rows[0] });
            })
            .catch((err) => {
                return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
            });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
});

module.exports = route;
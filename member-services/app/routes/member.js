const express = require('express');
const { where } = require('../lib/utils/queryBuilder.js');
const sendMail = require('../lib/utils/sendMail.js');
const db = require('../../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const paginate = require('../lib/hooks/paginate.js');


const app = express();
const router = express.Router();
router.get('/', (req, res) => {
    const authorization = req.headers['authorization'];
    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { queryResult, fields, values } = where(req);

        let query = 'SELECT id, fullname, username, email, phone_number FROM members';
        if (fields.length > 0) {
            query += queryResult;
        }

        query += ' ORDER BY createdAt DESC';

        if (limit > 0) {
            query += ' LIMIT ' + limit + ' OFFSET ' + offset;
        }

        db.execute(query, values)
            .then(([rows]) => {
                let countQuery = 'SELECT COUNT(*) AS totalCount FROM members';
                if (fields.length > 0) {
                    countQuery += queryResult;
                }
                const countResult = db.execute(countQuery, values).then(([rows]) => rows[0]);
                const total = countResult.totalCount;
                return res.status(200).json(paginate(req, rows, total));
            })
            .catch((err) => {
                return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
            });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});
router.post('/login', (req, res) => {
    const username = req.body.username || req.query.username;
    const password = req.body.password || req.query.password;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        const query = 'SELECT * FROM members WHERE username = ? OR phone_number = ? LIMIT 1';

        db.execute(query, [username, username])
            .then(([rows]) => {
                if (rows.length > 0) {
                    const hashedPassword = rows[0].password;
                    const passwordMatch = bcrypt.compareSync(password, hashedPassword);
                    if (!passwordMatch) {
                        return res.status(401).json({ success: false, message: 'Invalid username or password' });
                    }
                    return res.status(200).json({ success: true, message: 'Login successful', username: rows[0].username, token: jwt.sign({ slug: rows[0].slug, fullname: rows[0].fullname, username: rows[0].username, email: rows[0].email, phone_number: rows[0].phone_number }, process.env.JWT_SECRET, { expiresIn: '1d' }) });
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

router.post('/register', (req, res) => {
    const { fullname, password, confirmPassword, email, phoneNumber } = req.body;
    if (!fullname || !password || !confirmPassword || !phoneNumber || !email) {
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
        const searchUserQuery = 'SELECT * FROM members WHERE email = ? OR phone_number = ? LIMIT 1';

        db.execute(searchUserQuery, [email, phoneNumber])
            .then(async ([rows]) => {
                if (rows.length > 0) {
                    return res.status(400).json({ success: false, message: 'Username already exists' });
                } else {
                    const slug = uuidv4().toString();
                    const newPassword = await bcrypt.hash(password, 10);
                    const query = 'INSERT INTO members (slug,fullname, username, password, email,phone_number) VALUES (?, ?, ?, ?, ?, ?)';
                    db.execute(query, [slug, fullname, username, newPassword, email, phoneNumber])
                        .then(() => {
                            return res.status(200).json({ success: true, message: 'Registration successful', token: jwt.sign({ slug, fullname, username, email, phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1d' }) });
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


router.get('/logout', (req, res) => {
    const authorization = req.headers['authorization'];
    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const query = 'UPDATE members SET last_login = NOW() WHERE slug = ?';
        db.execute(query, [decoded.slug])
            .then(() => {
                return res.status(200).json({ success: true, message: 'Logout successful' });
            })
            .catch((err) => {
                return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
            });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

router.get('/profile', (req, res) => {
    const authorization = req.headers['authorization'];
    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const query = 'SELECT fullname, username, email, phone_number FROM members WHERE slug =? LIMIT 1';
        db.execute(query, [decoded.slug])
            .then(([rows]) => {
                if (rows.length > 0) {
                    return res.status(200).json({ success: true, message: 'Profile retrieved successfully', profile: rows[0] });
                } else {
                    return res.status(404).json({ success: false, message: 'Profile not found' });
                }
            })
            .catch((err) => {
                return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
            });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

router.post('/forgot-password', (req, res) => {
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const query = 'SELECT * FROM members WHERE email = ? LIMIT 1';
        db.execute(query, [email])
            .then(async ([rows]) => {
                if (rows.length > 0) {
                    const mailResult = await sendMail({
                        to: email,
                        subject: 'Password Reset',
                        action_url: `${process.env.REDIRECT_EMAIL_URL}/reset-password?email=${email}`
                    });
                    if (mailResult.status === false) {
                        return res.status(500).json({ success: false, message: mailResult.message, error: mailResult.error });
                    }
                    return res.status(200).json({ success: true, message: mailResult.message || 'Password reset link sent successfully' });

                } else {
                    return res.status(404).json({ success: false, message: 'Email not found' });
                }
            })
            .catch((err) => {
                return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
            });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
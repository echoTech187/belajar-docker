const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

function generateToken(data) {
    const token = jwt.sign({ slug: data.slug, username: data.fullname, username: data.username, phone_number: data.phone_number }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
}
function verifyToken(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
}
function validateHeader(req) {
    const authorization = req.headers['authorization'];

    const token = authorization.split(' ')[1];
    if (!token) {
        return false;
    }
    return token;
}
async function generatePassword(password) {
    const newPassword = await bcrypt.hash(password, 10);
    return newPassword;
}
function comparePassword(password, hashedPassword) {
    const passwordMatch = bcrypt.compareSync(password, hashedPassword);
    return passwordMatch;
}

module.exports = { generateToken, generatePassword, comparePassword, verifyToken, validateHeader };
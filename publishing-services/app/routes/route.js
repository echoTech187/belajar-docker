const express = require('express');
const route = express.Router();

route.get('/publishing', (req, res) => {
    res.status(200).json({ message: 'Publishing service is running' });
});

module.exports = route;
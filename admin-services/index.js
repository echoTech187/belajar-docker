const express = require('express');
const cors = require('cors');
require('dotenv').config();
const adminRoutes = require('./app/routes/admin');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/api/v1', adminRoutes);

app.listen(3001, () => {
    console.log('Admin Services listening on port 3001');
});
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./app/routes/auth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/v1', authRoutes);

app.listen(3001, () => {
    console.log('Admin Services listening on port 3001');
});
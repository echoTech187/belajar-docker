require('dotenv').config();
const express = require('express');
const cors = require('cors');
const memberRouter = require('./app/routes/member.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/api/v1', memberRouter);

app.listen(3002, () => {
    console.log('Member services listening on port 3002');
});
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const publishingRouter = require('./app/routes/route.js');

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

app.use('/api/v1', publishingRouter);

app.listen(3003, () => {
    console.log('Publishing services listening on port 3003');
});

module.exports = app;
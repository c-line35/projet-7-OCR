const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/user');
const postsRoutes = require('./routes/posts');

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/posts', postsRoutes);

module.exports = app;
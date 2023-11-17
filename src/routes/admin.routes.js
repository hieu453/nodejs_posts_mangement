const express = require('express');
const middlewares = require('../middlewares/authPage');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router()

router.get('/dashboard', [middlewares.authPage, isAdmin], (req, res) => res.send('dashboard page'))

module.exports = router;
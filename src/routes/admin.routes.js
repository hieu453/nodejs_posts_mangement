const express = require('express');
const middlewares = require('../middlewares/authPage');

const router = express.Router()

router.get('/dashboard',middlewares.authPage, (req, res) => res.send('dashboard page'))

module.exports = router;
const express = require('express');
const middlewares = require('../middlewares/authPage');
const isAdmin = require('../middlewares/isAdmin');
const AdminController = require('../controllers/AdminController');

const router = express.Router()

router.get('/dashboard', [middlewares.authPage, isAdmin], AdminController.dashboard)
router.get('/all-users', [middlewares.authPage, isAdmin], AdminController.allUsers)
router.get('/create-user', [middlewares.authPage, isAdmin], AdminController.createUser)
router.get('/all-posts', [middlewares.authPage, isAdmin], AdminController.allPosts)

module.exports = router;
const express = require('express');
const middlewares = require('../middlewares/authPage');
const isAdmin = require('../middlewares/isAdmin');
const AdminController = require('../controllers/AdminController');
const validator = require('../utils/validator.js')

const router = express.Router()

router.get('/dashboard', [middlewares.authPage, isAdmin], AdminController.dashboard)
router.get('/all-users', [middlewares.authPage, isAdmin], AdminController.allUsers)
router.get('/create-user', [middlewares.authPage, isAdmin], AdminController.createUser)
router.post('/create-user', [middlewares.authPage, isAdmin], validator.auth(), AdminController.saveUser)
router.get('/all-posts', [middlewares.authPage, isAdmin], AdminController.allPosts)
router.get('/edit-user/:id', [middlewares.authPage, isAdmin], AdminController.editUser)
router.post('/edit-user/:id', [middlewares.authPage, isAdmin], validator.auth(), AdminController.saveChangeUser)
router.get('/settings', [middlewares.authPage, isAdmin], AdminController.setting)
router.post('/settings', [middlewares.authPage, isAdmin], validator.changeUsernameAndEmail(), AdminController.saveSetting)


module.exports = router;
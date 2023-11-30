const express = require('express');
const middlewares = require('../middlewares/authPage');
const isAdmin = require('../middlewares/isAdmin');
const AdminController = require('../controllers/AdminController');
const validator = require('../utils/validator.js')
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer')
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './src/public/uploads/post_image')
	},
	filename: function (req, file, cb) {
		cb(null, uuidv4() +  file.originalname)
	}
})
const upload = multer({storage: storage})

const router = express.Router()

router.get('/dashboard', [middlewares.authPage, isAdmin], AdminController.dashboard)
router.get('/all-users', [middlewares.authPage, isAdmin], AdminController.allUsers)
router.get('/create-user', [middlewares.authPage, isAdmin], AdminController.createUser)
router.post('/create-user', [middlewares.authPage, isAdmin], validator.auth(), AdminController.saveUser)
router.get('/all-posts', [middlewares.authPage, isAdmin], AdminController.allPosts)
router.get('/edit-user/:id', [middlewares.authPage, isAdmin], AdminController.editUser)
router.post('/edit-user/:id', [middlewares.authPage, isAdmin], validator.changeUsernameAndEmail(), AdminController.saveChangeUser)
router.get('/edit-user/:id/password', [middlewares.authPage, isAdmin], AdminController.editUserPassword)
router.post('/edit-user/:id/password', [middlewares.authPage, isAdmin], validator.passwordCheck(), AdminController.saveChangeUserPassword)
router.get('/user/:id/delete', [middlewares.authPage, isAdmin], AdminController.removeUser)
router.get('/settings', [middlewares.authPage, isAdmin], AdminController.setting)
router.post('/settings', [middlewares.authPage, isAdmin], validator.changeUsernameAndEmail(), AdminController.saveSetting)
router.get('/password-setting', [middlewares.authPage, isAdmin], AdminController.passwordSetting)
router.post('/password-setting', [middlewares.authPage, isAdmin], validator.newPasswordCheck(), AdminController.saveNewPassword)
router.get('/all-posts', [middlewares.authPage, isAdmin], AdminController.allPosts)
router.get('/create-post', [middlewares.authPage, isAdmin], AdminController.createPost)
router.post('/create-post', [middlewares.authPage, isAdmin], upload.single('image'), AdminController.savePost)
router.get('/edit-post/:id', [middlewares.authPage, isAdmin], AdminController.editPost)
router.post('/edit-post/:id', [middlewares.authPage, isAdmin], upload.single('image'), AdminController.updatePost)
router.get('/post/:id/delete', [middlewares.authPage, isAdmin], AdminController.removePost)

module.exports = router;
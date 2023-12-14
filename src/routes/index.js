const adminRoutes = require('./admin.routes.js')
const passport = require('passport')
const middlewares = require('../middlewares/authPage.js')
const validator = require('../utils/validator.js')
const SignupController = require('../controllers/SignupController.js')
const LoginController = require('../controllers/LoginController.js')
const HomeController = require('../controllers/HomeController.js')
const ForgotPasswordController = require('../controllers/ForgotPasswordController.js')
const UserController = require('../controllers/UserController.js')
const { v4: uuidv4 } = require('uuid')
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


module.exports = (app) => {
    //Admin
    app.use('/admin', adminRoutes)

    //Home
    app.get('/', HomeController.index)
    app.get('/search', HomeController.search)  
    app.get('/post/:id', HomeController.postDetail) 

    //User
    app.get('/user/change-info', middlewares.authPage, UserController.changeInfo)
    app.post('/user/change-info', middlewares.authPage, validator.changeUsernameAndEmail(), UserController.saveInfo)
    app.get('/user/change-password', middlewares.authPage, UserController.changePassword)
    app.post('/user/change-password', middlewares.authPage, validator.newPasswordCheck(), UserController.savePassword)
    app.get('/user/posts', middlewares.authPage, UserController.mangePost)
    app.get('/user/edit-post/:id', middlewares.authPage, UserController.editPost)
    app.post('/user/edit-post/:id', upload.single('image'), middlewares.authPage, UserController.updatePost)
    app.get('/user/delete-post/:id', middlewares.authPage, UserController.removePost)
    app.get('/user/write-post', middlewares.authPage, UserController.writePost)
    app.post('/user/write-post', upload.single('image'), UserController.savePost)
    
    //Login
    app.get('/login', LoginController.index)
    app.post('/login', passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash : true,
            keepSessionInfo: true
        }),
        LoginController.loggedIn
    )  
    app.get('/logout', LoginController.logout)

    //Signup
    app.get('/signup', SignupController.index)
    app.get('/signed-up', SignupController.signedUp)
    app.post('/signup', validator.auth(), SignupController.signUp)


    //Forgot password
    app.get('/forgot-password', ForgotPasswordController.index)
    app.get('/reset-password/:id/:resetString', ForgotPasswordController.resetPasswordPage)
    app.post('/requestResetPassword', ForgotPasswordController.requestResetPassword)
    app.post('/reset-password/:id/:resetString', ForgotPasswordController.ResetPassword)
}
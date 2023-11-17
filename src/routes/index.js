const adminRoutes = require('./admin.routes.js')
const bcrypt = require('bcrypt')
const User = require('../models/User.js')
const passport = require('passport')
const middlewares = require('../middlewares/authPage.js')
const postRoutes = require('../routes/post.routes.js')
const validator = require('../utils/validator.js')
const SignupController = require('../controllers/SignupController.js')
const LoginController = require('../controllers/LoginController.js')
const HomeController = require('../controllers/HomeController.js')
const { validationResult } = require('express-validator')

const ForgotPasswordController = require('../controllers/ForgotPasswordController.js')


module.exports = (app) => {
    app.use('/admin', adminRoutes)
    app.use('/post', postRoutes)
    app.get('/about', middlewares.authPage, (req, res)=>res.send('about page'))

    //Home
    app.get('/', HomeController.index)   

    //User
    app.get('/user/manage-post', middlewares.authPage, (req, res) => {
        res.render('user/manage-post')
    })

    app.get('/user/change-info', middlewares.authPage, async (req, res) => {
        const user = await User.findById(req.user._id)
        
        res.render('user/change-info', { user })
    })

    app.post('/user/change-info', middlewares.authPage, validator.changeUsernameAndEmail(), async (req, res) => {
        const result = validationResult(req)
        const errors = result.array()  
        if ((req.body.name != req.user.name) || (req.body.email != req.user.email)) {
            if (errors.length > 0) {
                res.render('user/change-info', {errors})
            } else {
                try {
                    await User.findByIdAndUpdate(req.user._id, {
                        name: req.body.name,
                        email: req.body.email
                    }, { runValidators: true, context: 'query' })
                    req.session.message = {
                        type: 'success',
                        text: 'Thông tin đã được thay đổi'
                    }
                    res.redirect('/user/change-info')
                } catch(err) {
                    req.session.message = {
                        type: 'danger',
                        text: 'Tên người dùng hoặc email đã tồn tại'
                    }
                    res.redirect('/user/change-info')
                }
            }
        } else {
            req.session.message = {
                type: 'success',
                text: 'Thông tin đã được thay đổi'
            }
            res.redirect('/user/change-info')
        }
    })

    app.get('/user/change-password', middlewares.authPage, (req, res) => {
        res.render('user/change-password')
    })

    app.post('/user/change-password', middlewares.authPage, validator.newPasswordCheck(), (req, res) => {
        bcrypt.compare(req.body.password, req.user.password)
            .then(async (result) => {
                if (result) {
                    const errors = validationResult(req)
                    const errorsArray = errors.array()  

                    if (errorsArray.length > 0) {
                        res.render('user/change-password', {errorsArray})
                    } else {
                        const newPassword = await bcrypt.hash(req.body.newPassword, 10)
                        await User.findByIdAndUpdate(req.user._id, { password: newPassword })
                        req.session.message = {
                            type: 'success',
                            text: "Thông tin đã được lưu lại"
                        }
                        res.redirect('/user/change-info')
                    }
                } else {
                    res.render('user/change-password', {errMsg: "Mật khẩu cũ không đúng"})
                }
            })
            .catch((err) => {
                console.log(err)
            })
    })
    
    //Login
    app.get('/login', LoginController.index)
    app.post('/login', passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash : true,
            
        }),
        LoginController.loggedIn
    )  
    app.get('/logout', LoginController.logout)

    //Signup
    app.get('/signup', SignupController.index)
    app.get('/signed-up', SignupController.signedUp)
    app.post('/signup',validator.auth(), SignupController.signUp)


    //Forgot password
    app.get('/forgot-password', ForgotPasswordController.index)
    app.get('/reset-password/:id/:resetString', ForgotPasswordController.resetPasswordPage)
    app.post('/requestResetPassword', ForgotPasswordController.requestResetPassword)
    app.post('/reset-password/:id/:resetString', ForgotPasswordController.ResetPassword)
}
const adminRoutes = require('./admin.routes.js')
const bcrypt = require('bcrypt')
const User = require('../models/User.js')
const passport = require('passport')
const middlewares = require('../middlewares/authPage.js')
const postRoutes = require('../routes/post.routes.js')
const validator = require('../utils/validator.js')
require('dotenv').config()
const SignupController = require('../controllers/SignupController.js')
const LoginController = require('../controllers/LoginController.js')
const HomeController = require('../controllers/HomeController.js')
const { v4: uuidv4 } = require('uuid');

const nodemailer = require('nodemailer')
const ResetPassword = require('../models/ResetPassword.js')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})

transporter.verify((err, success) => {
    if (err) {console.log(err)}
    else {
        console.log('Ready for messages')
        console.log(success)
    }
})

module.exports = (app) => {
    app.use('/admin', adminRoutes)
    app.use('/post', postRoutes)
    app.get('/about', middlewares.authPage, (req, res)=>res.send('about page'))

    //Home
    app.get('/', HomeController.index)   
    
    //Login
    app.get('/login', LoginController.index)
    app.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash : true}), LoginController.loggedIn)  
    app.get('/logout', LoginController.logout)

    //Signup
    app.get('/signup', SignupController.index)
    app.get('/signed-up', SignupController.signedUp)
    app.post('/signup',validator.signupCheck(), SignupController.signUp)


    //Forgot password
    app.get('/forgot-password', (req, res) => res.render('auth/forgot-password'))
    app.get('/:id/:resetString', (req, res) => {
        const userId = req.params.id;
        const resetString = req.params.resetString;
        res.render('auth/reset-password', {userId, resetString})
    })

    app.post('/requestResetPassword', (req, res) => {
        const {email} = req.body;
        const redirectUrl = process.env.REDIRECT_URL + process.env.PORT
        
        User.find({email})
            .then(user => {
                if (user[0]) {
                    sendResetEmail(user[0], redirectUrl, res);
                } else {
                    res.json({message: "user doesn't exist"})
                }
            })
            .catch(err => console.log(err))
    })

    const sendResetEmail = ({_id, email}, redirectUrl, res) => {
        const resetString = uuidv4() + _id;
        
        ResetPassword.deleteMany({userId: _id})
            .then(() => {
                const mailOptions = {
                    from: process.env.AUTH_EMAIL,
                    to: email,
                    subject: "Password Reset",
                    html: `<p>Click this link below to reset your password</p>
                    <a href=${redirectUrl + "/" + _id + "/" + resetString}>Click Here</a>
                    `
                }

                const saltRounds = 10;
                bcrypt.hash(resetString, saltRounds)
                    .then(hashedString => {
                        const newResetPassword = new ResetPassword({
                            userId: _id,
                            resetString: hashedString,
                            expiredAt: Date.now() + 360000
                        })

                        newResetPassword.save()
                            .then(() => {
                                transporter.sendMail(mailOptions)
                                    .then(() => res.send('Email sent to reset your password'))
                                    .catch(err => console.log(err))
                            })
                            .catch(err => console.log(err))
                    })
            })
            .catch(err => console.log(err))
    }

    app.post('/reset-password/:id/:resetString', (req, res) => {
        const userId = req.params.id;
        const resetString = req.params.resetString;
        const newPassword = req.body.newPassword;

        ResetPassword.find({userId})
            .then(result => {
                if (result[0]) {
                    const {expiredAt} = result[0];

                    const hashedResetString = result[0].resetString

                    if (expiredAt < Date.now()) {
                        ResetPassword.deleteOne({userId})
                            .then(() => {
                                res.json({message: 'Password reset link has expired'})
                            })
                            .catch(err => console.log(err))
                    } else {
                        bcrypt.compare(resetString, hashedResetString)
                            .then(result => {
                                if (result) {
                                    const saltRounds = 10
                                    bcrypt.hash(newPassword, saltRounds)
                                        .then(hashedNewPassword => {
                                            User.updateOne({_id: userId}, {password: hashedNewPassword})
                                                .then(() => {
                                                    ResetPassword.deleteOne({userId})
                                                        .then(() => {
                                                            res.render('auth/reset-successfully')
                                                        })
                                                        .catch(err => console.log(err))
                                                })
                                                .catch(err => console.log(err))
                                        })
                                } else {
                                    res.json({message: 'reset failed'})
                                }
                            })
                            .catch(err => console.log(err))
                    }
                } else {
                    res.json({message: "Password Reset doesn't exist"})
                }
            })
            .catch(err => console.log(err))
    })
}
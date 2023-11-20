const User = require('../models/User')
require('dotenv').config()
const sendResetEmail = require('../utils/sendEmail.js')
const ResetPassword = require('../models/ResetPassword.js')
const bcrypt = require('bcrypt')

module.exports = {
    index(req, res) {
        res.render('auth/forgot-password')
    },
    resetPasswordPage(req, res) {
        const userId = req.params.id;
        const resetString = req.params.resetString;
        res.render('auth/reset-password', {userId, resetString})
    },
    requestResetPassword(req, res) {
        const {email} = req.body;
        const redirectUrl = process.env.REDIRECT_URL + process.env.PORT
        
        User.find({email})
            .then(user => {
                if (user[0]) {
                    sendResetEmail(user[0], redirectUrl, res);
                } else {
                    res.json({message: "Người dùng không tồn tại"})
                }
            })
            .catch(err => console.log(err))
    },
    ResetPassword(req, res) {
        if (req.body.newPassword != req.body.confirmNewPassword) {
            req.session.message = "Mật khẩu mới và xác nhận mật khẩu mới không khớp!"
            return res.redirect('back')
        }
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
                                res.json({message: 'Liên kết reset mật khẩu đã hết hạn'})
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
    }
}
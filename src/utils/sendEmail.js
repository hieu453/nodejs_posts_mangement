require('dotenv').config()
const ResetPassword = require('../models/ResetPassword.js')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})

module.exports = ({_id, email}, redirectUrl, res) => {
    const resetString = uuidv4() + _id;
    
    ResetPassword.deleteMany({userId: _id})
        .then(() => {
            const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: "Đặt lại mật khẩu",
                html: `<p>Click nút bên dưới để đặt lại mật khẩu</p>
                <a href=${redirectUrl + "/reset-password/" + _id + "/" + resetString}>Bấm vào đây</a>
                `
            }

            const saltRounds = 10;
            bcrypt.hash(resetString, saltRounds)
                .then(hashedString => {
                    const newResetPassword = new ResetPassword({
                        userId: _id,
                        resetString: hashedString,
                        expiredAt: Date.now() + 360000 // 6 phut
                    })

                    newResetPassword.save()
                        .then(() => {
                            transporter.sendMail(mailOptions)
                                .then(() => res.send('Email khôi phục mật khẩu đã được gửi'))
                                .catch(err => console.log(err))
                        })
                        .catch(err => console.log(err))
                })
        })
        .catch(err => console.log(err))
}
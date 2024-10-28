const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

module.exports = {
    // hiển thị ra trang đăng ký
    index(req, res) {
        res.render('auth/signup')
    },

    // cái này chắc là khi đăng ký xong thì hiển thị ra 1 trang là đã đăng ký, ko nhớ lắm
    signedUp(req, res) {
        res.render('auth/signed-up')
    },

    // đăng ký
    async signUp(req, res) {
        // kiểm tra xem username và email có trong database chưa
        const username = await User.exists({name: req.body.name})
        const email = await User.exists({email: req.body.email})
        const result = validationResult(req)
        const errors = result.array()     

        // nếu có rồi thì ném ra lỗi
        if (username) {
            errors.push({
                value: req.body.name,
                msg: 'Username đã tồn tại',
                path: 'name'
            })
        }
        if (email) {
            errors.push({
                value: req.body.email,
                msg: 'Email đã tồn tại',
                path: 'email'
            })
        }
        
        if (errors.length > 0) {
            res.render('auth/signup', {
                errors,
                requestName: req.body.name,
                requestEmail: req.body.email,
                requestPassword: req.body.password,
            })
        } else {
            // nếu chưa có thì bắt đầu lưu
            try {
                //sử dụng bcrypt để lưu
                bcrypt.hash((req.body.password).trim(), 10, function(err, hash) {
                    const defaultAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${req.body.name}`
                    const user = new User({
                        name: (req.body.name).trim(),
                        email: (req.body.email).trim(),
                        password: hash,
                        default_avatar: defaultAvatar,
                        role: 0,
                    })
                    
                    user.save()
                        .then(() => {
                            res.redirect('/signed-up')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                });
            } catch (err) {
                console.log(err)
            }
        }
    }
}

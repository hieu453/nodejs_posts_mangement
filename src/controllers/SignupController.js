const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

module.exports = {
    index(req, res) {
        res.render('auth/signup')
    },

    signedUp(req, res) {
        res.render('auth/signed-up')
    },

    async signUp(req, res) {
        const username = await User.findOne({name: req.body.name})
        const email = await User.findOne({email: req.body.email})
        const result = validationResult(req)
        const errors = result.array()     
                   

        if (username) {
            errors.push({
                value: username.name,
                msg: 'Username đã tồn tại',
                path: 'name'
            })
        }
        if (email) {
            errors.push({
                value: email.email,
                msg: 'Email đã tồn tại',
                path: 'email'
            })
        }
        console.log(errors)
        
        if (errors.length > 0) {
            res.render('auth/signup', {errors})
        } else {
            try {
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    const defaultAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${req.body.name}`
                    const user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        default_avatar: defaultAvatar,
                        role: 0,
                    })
                    
                    user.save().then(() => {
                        res.redirect('/signed-up')
                    })
                });
            } catch (err) {
                console.log(err)
            }
        }
    }
}
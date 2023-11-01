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
                msg: 'Username da ton tai',
                path: 'name'
            })
        }
        if (email) {
            errors.push({
                msg: 'email da ton tai',
                path: 'email'
            })
        }
        
        if (errors.length > 0) {
            res.render('auth/signup', {errors})
        } else {
            try {
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    const user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        role: 0,
                    })
                    
                    user.save().then(user => {
                        res.redirect('/signed-up')
                    })
                });
            } catch (err) {
                console.log(err)
            }
        }
    }
}
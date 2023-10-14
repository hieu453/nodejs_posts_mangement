const adminRoutes = require('./admin.routes.js')
const bcrypt = require('bcrypt')
const User = require('../models/User.js')
const passport = require('passport')
const middlewares = require('../middlewares/authPage.js')
const postRoutes = require('../routes/post.routes.js')
const Post = require('../models/Post.js')
const moment = require('moment')
const validator = require('../utils/validator.js')
const { validationResult } = require('express-validator')

module.exports = (app) => {
    app.use('/admin', adminRoutes)
    app.use('/post', postRoutes)

    app.get('/', async (req, res)=> {
        const posts = await Post.find({})
        req.session.isLoggedIn = req.isAuthenticated()
        
        res.render('index', {
            user: req.user,
            posts,
            moment
        })
    })   
    
    app.get('/about', middlewares.authPage, (req, res)=>res.send('about page'))


    app.get('/login', (req, res) => {
        const errmessage = req.flash('error')[0]
        res.render('auth/login', { message: errmessage })
    })
    app.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash : true}), (req, res) => {
        if (req.user.role == 1) {
            req.session.isLoggedIn = req.isAuthenticated();
            res.redirect('/admin/dashboard')
        } else {
            req.session.isLoggedIn = req.isAuthenticated();
            res.redirect('/')
        }
    })  

    app.get('/logout', (req, res, next) => {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    })

    app.get('/signup', (req, res) => {
        res.render('auth/signup')
    })

    app.get('/signed-up', (req, res) => {
        res.render('auth/signed-up')
    })

    app.post('/signup',validator.signupCheck(), async (req, res) => {
            const username = await User.findOne({name: req.body.name})
            const email = await User.findOne({email: req.body.email})
            let error = {};
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
                            role: 0
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
    )
}
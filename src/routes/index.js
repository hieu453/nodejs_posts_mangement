const adminRoutes = require('./admin.routes.js')
const bcrypt = require('bcrypt')
const User = require('../models/User.js')
const passport = require('passport')
const middlewares = require('../middlewares/authPage.js')
const postRoutes = require('../routes/post.routes.js')
const Post = require('../models/Post.js')
const moment = require('moment')

module.exports = (app) => {
    app.use('/admin', adminRoutes)
    app.use('/post', postRoutes)

    app.get('/', async (req, res)=> {
        const posts = await Post.find({})
        if (req.user) {
            res.render('index', {
                isLoggedIn: req.isAuthenticated(),
                user: req.user,
                posts,
                moment
            })
        } else {
            res.render('index', {
                isLoggedIn: req.isAuthenticated(),
                posts,
                moment
            })
        }
    })   
    
    app.get('/about', middlewares.authPage, (req, res)=>res.send('about page'))


    app.get('/login', (req, res) => {
        const errmessage = req.flash('error')[0]
        res.render('auth/login', { message: errmessage })
    })
    app.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash : true}), (req, res) => {
        if (req.user.role == 1) {
            res.redirect('/admin/dashboard')
        } else {
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
    app.post('/signup', (req, res) => {
        try {
            bcrypt.hash(req.body.password, 10, function(err, hash) {
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    role: 0
                })
                
                user.save().then(userSaved => {
                    if (userSaved.role == 1) {
                        res.redirect('/admin/dashboard')
                    } else {
                        res.redirect('/')
                    }
                })
            });
        } catch (err) {
            console.log(err)
        }
        
       
    })
}
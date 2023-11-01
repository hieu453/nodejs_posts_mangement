const moment = require('moment')
const Post = require('../models/Post.js')

module.exports = {
    async index(req, res) {
        const posts = await Post.find({})
        req.session.isLoggedIn = req.isAuthenticated()
        req.session.user = req.user;
        res.render('index', {
            posts,
            moment
        })
    }
}
const express = require('express');
const middlewares = require('../middlewares/authPage');
const router = express.Router()
const Post = require('../models/Post.js')
const moment = require('moment')

router.get('/write-post', middlewares.authPage ,(req, res, next) => res.render('posts/write-post', { isLoggedIn: req.isAuthenticated(), user: req.user }))
router.post('/write-post', (req, res) => {
    const data = {
        title: req.body.title,
        author: req.user.name,
        description: req.body.description
    }
    const post = new Post(data)
    post.save()
        .then(() => console.log('success'))
        .catch(err => console.log(err))

    res.redirect('/')
})

router.get('/:id', async (req, res, next) => {
    const post = await Post.findById(req.params.id)
    
    res.render('posts/post', {
        isLoggedIn: req.isAuthenticated(),
        user: req.user,
        post: post,
        moment: moment
    })
})

module.exports = router;
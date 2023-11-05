const express = require('express');
const middlewares = require('../middlewares/authPage');
const router = express.Router()
const Post = require('../models/Post.js')
const moment = require('moment')

router.get('/write-post', middlewares.authPage ,(req, res, next) => res.render('posts/write-post', { 
    
    user: req.user 
}))

router.post('/write-post', (req, res) => {
    const data = {
        title: req.body.title,
        author: req.user.name,
        description: req.body.description
    }
    const post = new Post(data)
    post.save()
        .then(() => {
            return res.redirect('/')
        })
        .catch(err => {
            return res.json({message: err.message})
        })

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
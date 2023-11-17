const express = require('express');
const middlewares = require('../middlewares/authPage');
const router = express.Router()
const Post = require('../models/Post.js')
const moment = require('moment')
const multer  = require('multer')
const { v4: uuidv4 } = require('uuid');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './src/public/uploads/post_image')
	},
	filename: function (req, file, cb) {
		cb(null, uuidv4() +  file.originalname)
	}
})
const upload = multer({storage: storage})

router.get('/write-post', middlewares.authPage ,(req, res, next) => res.render('posts/write-post', { 
    user: req.user 
}))

router.post('/write-post', upload.single('image'), (req, res) => {
    const data = {
        title: req.body.title,
        author: req.user.name,
        image: req.file.filename,
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
    try {
        const post = await Post.findById(req.params.id)
    
        res.render('posts/post', {
            isLoggedIn: req.isAuthenticated(),
            user: req.user,
            post: post,
            moment: moment
        })
    } catch (err) {
        res.json({message: "post doesn't exist"})
    }
   
})

module.exports = router;
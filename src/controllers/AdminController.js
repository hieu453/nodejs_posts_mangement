const User = require('../models/User.js')
const Post = require('../models/Post.js')

module.exports = {
    async dashboard(req, res) {
        const users = await User.count({})
        const posts = await Post.count({})
       
        res.render('admin/dashboard', {
            users,
            posts
        })
    },

    async allUsers(req, res) {
        const users = await User.find({ _id: { $ne: req.user._id } })
        
        res.render('admin/users/all_users', {
            users
        })
    },

    createUser(req, res) {
        res.render('admin/users/create_user')
    },

    async allPosts(req, res) {

    }
}
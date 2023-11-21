const User = require('../models/User.js')
const Post = require('../models/Post.js')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')

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

    async saveUser(req, res) {
        const username = await User.exists({name: req.body.name})
        const email = await User.exists({email: req.body.email})
        const result = validationResult(req)
        const errors = result.array()     

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
            res.render('admin/users/create_user', {
                errors,
                requestName: req.body.name,
                requestEmail: req.body.email,
                requestPassword: req.body.password,
            })
        } else {
            try {
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    const defaultAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${req.body.name}`
                    const user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        default_avatar: defaultAvatar,
                        role: req.body.role,
                    })
                    
                    user.save()
                        .then(() => {
                            req.session.message = {
                                text: "Đã tạo người dùng",
                                type: "success"
                            }
                            res.redirect('/admin/all-users')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                });
            } catch (err) {
                console.log(err)
            }
        }
    },

    async editUser(req, res) {
        const user = await User.findById(req.params.id)
        res.render('admin/users/edit_user', {
            user
        })
    },

    async saveChangeUser(req, res) {
        const username = await User.findOne({name: req.body.name, _id: { $ne: req.params.id }})
        const email = await User.findOne({email: req.body.email, _id: { $ne: req.params.id }})
        const result = validationResult(req)
        const errors = result.array() 
        
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
            res.render('admin/users/edit_user', {
                errors,
                requestName: req.body.name,
                requestEmail: req.body.email,
                requestPassword: req.body.password,
            })
        } else {
            bcrypt.hash(req.body.password, 10, async function(err, hash) {
                await User.findByIdAndUpdate(req.params.id, {
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    role: req.body.role
                })

                req.session.message = {
                    text: "Đã lưu thông tin thay đổi",
                    type: "success"
                }
                res.redirect('/admin/all-users')
            })
            
        }
    },

    async setting(req, res) {
        const user = await User.findById(req.user._id).exec();

        res.render('admin/settings', { user })
    },

    async saveSetting(req, res) {
        const result = validationResult(req)
        const errors = result.array()  
        if ((req.body.name != req.user.name) || (req.body.email != req.user.email)) {
            
            if (errors.length > 0) {
                res.render('admin/settings', { errors })
            } else {
                try {
                    await User.findByIdAndUpdate(req.user._id, {
                        name: req.body.name,
                        email: req.body.email
                    }, { runValidators: true, context: 'query' },)
                    req.session.message = {
                        type: 'success',
                        text: 'Thông tin đã được thay đổi'
                    }
                    console.log(req.body.email)
                    res.redirect('/admin/settings')
                } catch(err) {
                    req.session.message = {
                        type: 'danger',
                        text: 'Tên người dùng hoặc email đã tồn tại'
                    }
                    res.redirect('/admin/settings')
                }
            }
        } else {
            req.session.message = {
                type: 'success',
                text: 'Thông tin đã được thay đổi'
            }
            res.redirect('/admin/settings')
        }
    },

    async allPosts(req, res) {

    }
}
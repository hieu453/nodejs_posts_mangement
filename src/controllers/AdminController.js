const User = require('../models/User.js')
const Post = require('../models/Post.js')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const moment = require('moment')
moment.locale('vi')
const fs = require('fs')

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

    editUser(req, res) {
        User.findById(req.params.id)
            .then((_user) => {
                res.render('admin/users/edit_user', {
                    _user
                })
            })
            .catch(() => {
                res.send("Không tìm thấy người dùng")
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
            const _user = await User.findById(req.params.id)
            res.render('admin/users/edit_user', {
                _user,
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

    editUserPassword(req, res) {
        User.findById(req.params.id)
            .then((_user) => {
                res.render('admin/users/change_user_password', {
                    _user
                })
            })
            .catch(() => {
                res.send("Không tìm thấy người dùng")
            })
    },

    async saveChangeUserPassword(req, res) {
        const result = validationResult(req)
        const errors = result.array() 

        if (errors.length > 0) {
            const _user = await User.findById(req.params.id)
            res.render('admin/users/change_user_password', {
                _user,
                errors,
                requestPassword: req.body.password,
            })
        } else {
            bcrypt.hash(req.body.password, 10, async function(err, hash) {
                await User.findByIdAndUpdate(req.params.id, {
                    password: hash,
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

    passwordSetting(req, res) {
        res.render('admin/password-setting')
    },

    saveNewPassword(req, res) {
        bcrypt.compare(req.body.password, req.user.password)
            .then(async (result) => {
                if (result) {
                    const errors = validationResult(req)
                    const errorsArray = errors.array()  

                    if (errorsArray.length > 0) {
                        res.render('admin/password-setting', {errorsArray})
                    } else {
                        const newPassword = await bcrypt.hash(req.body.newPassword, 10)
                        await User.findByIdAndUpdate(req.user._id, { password: newPassword })
                        req.session.message = {
                            type: 'success',
                            text: "Thông tin đã được lưu lại"
                        }
                        res.redirect('/admin/password-setting')
                    }
                } else {
                    res.render('admin/password-setting', {errMsg: "Mật khẩu cũ không đúng"})
                }
            })
            .catch((err) => {
                console.log(err)
            })
    },

    async allPosts(req, res) {
        const posts = await Post.find({}).sort({ createdAt: -1 }).exec();

        res.render('admin/posts/all_posts', {
            posts,
            moment
        })
    },

    createPost(req, res) {
        res.render('admin/posts/create_post')
    },

    savePost(req, res) {
        const data = {
            title: req.body.title,
            author: req.user.name,
            image: req.file.filename,
            description: req.body.description
        }
        const post = new Post(data)
        post.save()
            .then(() => {
                req.session.message = {
                    text: "Viết bài thành công",
                    type: "success"
                }
                return res.redirect('/admin/all-posts')
            })
            .catch(err => {
                return res.json({message: err.message})
            })
    },

    async editPost(req, res) {
        const post = await Post.findById(req.params.id)

        res.render('admin/posts/edit_post', {post})
    },

    async updatePost(req, res) {
        let newImage = '';
       
        if (req.file) {
            newImage = req.file.filename;

            fs.unlink('./src/public/uploads/post_image/' + req.body.old_image, (err) => {
                err ? console.log(err) : console.log('old image was removed')
            })
        } else {
            newImage = req.body.old_image
        }
        

        try {
            await Post.findByIdAndUpdate(req.params.id, {
                title: req.body.title,
                description: req.body.description,
                author: req.user.name,
                image: newImage,
                modified: 1
            })
            req.session.message = {
                text: 'Cập nhật bài viết thành công',
                type: 'success'
            }
            res.redirect('/admin/all-posts')
        } catch (err) {
            res.json({ message: err.message });
        }
    },

    removePost(req, res) {
        Post.findByIdAndDelete(req.params.id)
        .then(() => {
            fs.unlink('./src/public/uploads/post_image/' + post.image, (err) => {
                err ? console.log(err) : console.log('old image was removed')
            })
            req.session.message = {
                text: "Đã xóa bài viết!",
                type: "success"
            }
            res.redirect('/admin/all-posts')
        })
    }
}
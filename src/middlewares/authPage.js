const User = require('../models/User.js')

const middlewares = {
    authPage: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return res.redirect('/login')
        }
        next();
    },

}

module.exports = middlewares
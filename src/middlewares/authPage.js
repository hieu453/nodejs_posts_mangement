
const middlewares = {
    authPage: function (req, res, next) {
        if (!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl;
            return res.redirect('/login')
        }
        next();
    },

}

module.exports = middlewares

module.exports = {
    index(req, res) {
        if (!req.session.isLoggedIn) {
            const errmessage = req.flash('error')[0]
        
            res.render('auth/login', { message: errmessage })
        } else {
            res.redirect('/')
        }
    },

    loggedIn(req, res) {
        
        if (req.body.rememberMe) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        } else {
            req.session.cookie.maxAge = null;
        }
    
        if (req.user.role == 1) {
            req.session.isLoggedIn = req.isAuthenticated();
            req.session.user = req.user;
            res.redirect(req.session.returnTo || '/admin/dashboard')
            delete req.session.returnTo;
        } else {
            req.session.isLoggedIn = req.isAuthenticated();
            req.session.user = req.user;
            res.redirect(req.session.returnTo || '/')
            delete req.session.returnTo;
        }
    },

    logout(req, res, next) {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    }
}
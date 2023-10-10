const Setting = require('../models/Setting.js')

module.exports = {
    async isBlog(req, res, next) {
        try {
            const blogSetting = await Setting.find({})

            
            if (blogSetting.length == 0 && req.originalUrl != '/blog/setup') {
                
                res.redirect('/blog/setup')
            } else {
                next();
            }
        } catch (err) {
            console.log(err)
        }
       
    }
}
const moment = require('moment')
const Post = require('../models/Post.js')
const boostrapPaginator = require('../configs/bootstrapPaginator.js');
const bootstrapPaginator = require('../configs/bootstrapPaginator.js');

module.exports = {
    async index(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = 3; // Number of items per page

        const result = await Post.paginate({}, { page, limit });

        const bPaginator = bootstrapPaginator(page, limit, result)


        res.render('index', {
            posts: result.docs,
            page, 
            pages: result.pages,
            moment,
            bPaginator
        });
            
    }
}
const moment = require('moment')
moment.locale('vi')
const Post = require('../models/Post.js')
const bootstrapPaginator = require('../utils/bootstrapPaginator.js');
const bootstrapPaginatorForSearch = require('../utils/bPaginatorForSearch.js')

module.exports = {
    async index(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = 9; // Number of items per page
        
        const result = await Post.paginate({}, { page, limit, sort: { createdAt: -1 } });
        
        const bPaginator = bootstrapPaginator(page, limit, result)


        res.render('index', {
            title: "Trang chủ | Các bài viết",
            posts: result.docs,
            page, 
            pages: result.pages,
            moment,
            bPaginator,
        });
            
    },

    async search(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = 9; // Number of items per page

        const result = await Post.paginate({'title' : new RegExp(req.query.search, 'i')}, { page, limit, sort: { createdAt: -1 } });

        const bPaginatorForSearch = bootstrapPaginatorForSearch(page, limit, result, req.query.search)

        res.render('search_result', {
            title: "Kết quả tìm kiếm",
            searchValue: req.query.search,
            posts: result.docs,
            page, 
            pages: result.pages,
            moment,
            bPaginatorForSearch
        });
        
    },

    async postDetail(req, res) {
        try {
            const post = await Post.findById(req.params.id)
        
            res.render('posts/post', {
                title: post.title,
                post: post,
                moment: moment
            })
        } catch (err) {
            res.json({message: "post doesn't exist"})
        }
    }
}
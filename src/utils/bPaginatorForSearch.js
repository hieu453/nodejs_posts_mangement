const pagination = require('pagination')

module.exports = (page, limit, result, q) => {
    const boostrapPaginator = new pagination.TemplatePaginator({
        prelink:'?', current: page, rowsPerPage: limit,
        totalResult: result.total, slashSeparator: false,
        template: function(result) {
            var i, len, prelink;
            var html = '<div><ul class="pagination">';
            if(result.pageCount < 2) {
                html += '</ul></div>';
                return html;
            }
            prelink = this.preparePreLink(result.prelink);
            html += '<li class="page-item"><a class="page-link" href="?page=1&search='+q+'">First</a></li>';
            if(result.previous) {
                html += '<li class="page-item"><a class="page-link" href="' + prelink + result.previous + '&search='+ q +'">' + this.options.translator('PREVIOUS') + '</a></li>';
            }
            if(result.range.length) {
                for( i = 0, len = result.range.length; i < len; i++) {
                    if(result.range[i] === result.current) {
                        html += '<li class="active page-item"><a class="page-link" href="' + prelink + result.range[i] + '&search='+ q +'">' + result.range[i] + '</a></li>';
                    } else {
                        html += '<li class="page-item"><a class="page-link" href="' + prelink + result.range[i] + '&search='+ q +'">' + result.range[i] + '</a></li>';
                    }
                }
            }
            if(result.next) {
                html += '<li class="page-item"><a class="page-link" href="' + prelink + result.next + '&search='+ q +'" class="paginator-next">' + this.options.translator('NEXT') + '</a></li>';
            }
            html += `<li class="page-item"><a class="page-link" href="?page=${result.pageCount}&search=${q}">Last</a></li>`;
            html += '</ul></div>';
            return html;
        }
    });

    return boostrapPaginator.render()
}
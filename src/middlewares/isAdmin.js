
module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        switch (req.user.role) {
            case 1:
                next();
                break;
            case 0:
                res.send("Bạn không có quyền truy cập vào admin")
                break;
            default:
                res.send("Bạn không có quyền truy cập vào admin")
        }
        
    } else {
        res.redirect('/login')
    }
}
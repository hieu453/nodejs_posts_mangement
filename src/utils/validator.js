const { check } = require('express-validator')

module.exports = {
    auth() {
        return [
            check('name', 'Username phải tối thiều 4 ký tự').isLength({min:4}),
            check('email', 'Email khônng hợp lệ').isEmail(),
            check('password', 'Password phải tối thiểu 6 ký tự').isLength({min:6}),
        ]
    },
    changeUsernameAndEmail() {
        return [
            check('name', 'Username phải tối thiều 4 ký tự').isLength({min:4}),
            check('email', 'Email khônng hợp lệ').isEmail(),
            
        ]
    },
    newPasswordCheck() {
        return check('newPassword', 'Password mới phải tối thiểu 6 ký tự').isLength({min:6})
    }
}

const { check } = require('express-validator')

module.exports = {
    signupCheck() {
        return [
            check('name', 'Username khong duoc de trong').not().isEmpty(),
            check('name', 'Username phai toi thieu 4 ky tu').isLength({min:4}),
            check('email', 'Email ko hop le').isEmail(),
            check('password', 'password phai toi thieu 6 ky tu').isLength({min:6})
        ]
    }
}

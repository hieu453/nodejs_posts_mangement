const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User.js')
const bcrypt = require('bcrypt')


module.exports = (req,passport) => {
    passport.use(new LocalStrategy(
        {
            usernameField: 'name'
        },
        async function(name, password, done) {
            try {
                const user = await User.findOne({ name: name.trim() }) 
                if (!user) {
                    return done(null, false, { message: 'Incorrect username' })
                }
                
                bcrypt.compare(password.trim(), user.password).then(function(result) {
                    if (result == false) {
                        return done(null, false, { message: 'Incorrect password' })
                    } else {
                        return done(null, user)
                    }
                });

            } catch (err) {
                return done(err)
            }
        }
    ));
    
    passport.serializeUser(function(user, done) {
        return done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .then((user) => {
                return done(null, user) 
            })
            .catch(err => { return done(err, null) })
    });
    
}
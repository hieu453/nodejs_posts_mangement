const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User.js')
const bcrypt = require('bcrypt')

module.exports = (passport) => {
    passport.use(new LocalStrategy(
        {
            usernameField: 'name'
        },
        async function(name, password, done) {
            try {
                const user = await User.findOne({ name: name }) 
                if (!user) {
                    return done(null, false, { message: 'Incorrect username' })
                    // console.log("Incorrect username.");
                }
                
                bcrypt.compare(password, user.password).then(function(result) {
                    if (result == false) {
                        return done(null, false, { message: 'Incorrect password' })
                        // console.log("Incorrect password.")
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
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .then((user) => done(null, user))
            .catch(err => done(err, null))
    });
}
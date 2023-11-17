require('dotenv').config()
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const session = require('express-session')
const router = require('./src/routes/index.js')
const viewEngineConfig = require('./src/configs/view.engine.config.js')
const dbConnect = require('./src/configs/db.config.js')
const flash = require('connect-flash')
const passport = require('passport')
const passportConfig = require('./src/configs/passport.config.js')
const port = process.env.PORT || 8000


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static('./src/public'))

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

app.use(flash())

app.use(passport.initialize());
app.use(passport.authenticate('session'));
app.use(passport.session());
app.use((req, res, next) => {
    passportConfig(req, passport);
    next();
})

app.use((req, res, next)=> {
    res.locals.message = req.session.message;
    res.locals.isLoggedIn = req.session.isLoggedIn
    res.locals.user = req.session.user;
    // res.locals.returnTo = req.session.returnTo;
    // console.log(req.session.returnTo + ' in middleware')
    delete req.session.message;
    next();
})

dbConnect()
viewEngineConfig(app)
  
router(app)



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
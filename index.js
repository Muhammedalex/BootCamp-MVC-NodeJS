if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
};

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require ('connect-flash');
const joi = require('joi');
const mongoSanitize = require('express-mongo-sanitize');
const ExpressError = require('./helpers/ExpressError');
const passport = require('passport');
const localpass = require('passport-local');
const User = require('./models/user');

const register = require('./routes/users');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews.js');
const helmet = require('helmet');
// const dbUrl = process.env.DB_URL;




mongoose.connect('mongodb://127.0.0.1:27017/Yelp-Camp',{
    useNewUrlParser : true,
    useUnifiedTopology : true
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error:"));
db.once('open',()=>{
    console.log('Database connected');
});

const app = express();

app.set('views' , path.join(__dirname,"views"));
app.engine('ejs' , ejsMate)
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize())

const sessionConfig = {
    secret : "thisshouldbemysecrethoney",
    resave : false,
    saveUninitialized : true,
    cookie: {
        httpOnly : true,
        expires : Date.now()+ 1000 * 60 * 60 * 24 * 7 ,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/drd5ccixg/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new localpass(User.authenticate()));
// passport.use(new localpass(User.serializeUser()));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localpass(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.returnTo = req.originalUrl
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// app.get('/fakeuser' , async(req,res)=>{
//     const user = new User({email : 'alex@gmail.com' , username : 'alexx' });
//     const newUser = await User.register(user , '142012');
//     res.send(newUser)
// })

app.use('/campgrounds' , campgrounds);
app.use('/', register);
app.use('/campgrounds/:id/reviews' , reviews)

app.get('/' ,(( req , res )=>{
    res.render('home')
}));


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found' , 404))
});
app.use((err,req,res,next)=>{
    
    const { statusCode = 500 } = err;
    if(!err.message)error.message='oh boy,something went wrong';
    res.status(statusCode).render('partials/error' , {err});
});

app.listen(3000 ,()=>{
    console.log('hello you are on 3000 server')
} )
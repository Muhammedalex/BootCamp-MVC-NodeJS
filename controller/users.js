const User = require('../models/user');

module.exports.register =  (req,res)=>{
    res.render('users/register');
};

module.exports.postRegister = async(req,res,next)=>{
    try{
       const {username , email , password } = req.body;
       const user = await new User({username,email});
       const regUser = await User.register(user,password);
       req.login(regUser,err =>{
        if(err)return next(err);
        req.flash('success','welcome to camp site');
        res.redirect('/campgrounds');
       })
    } catch(e){
        req.flash('error' , 'please try again');
        res.redirect('/register')
    }
    };

module.exports.loginForm = (req,res)=>{
    if(!req.user){
    res.render('users/login')
    }else{
        req.flash('success' , 'You have loggedin!')
        res.redirect('/campgrounds')
    }
}    

module.exports.loginAuth =  (req,res)=>{
    req.flash('success' , 'welcome back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}
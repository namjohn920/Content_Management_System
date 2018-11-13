const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local');

//Models
const Post = require('../../models/Posts'); 
const Category = require('../../models/Category');
const User = require('../../models/User');

//Routes
router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'main.handlebars';
    next();
});

router.get('/', (req,res) => {
    const perPage = 10;
    const page = req.query.page || 1;

    Post.find({})
    .skip((perPage * page)-perPage).limit(perPage)
    .then((posts)=>{
        Post.count().then(postCount => {
            Category.find({}).then(categories => {
                res.render('home/index', {
                    posts: posts, 
                    categories:categories,
                    current: parseInt(page),
                    pages: Math.ceil(postCount/perPage)
                });  
            });
        })
    }).catch(err => {
        if(err) throw err;
    });
});

//LOGIN
passport.use(new LocalStrategy({
    usernameField: 'email',
}, (email, password, done)=> {
    User.findOne({email: email}).then(user=>{
        if(!user) return done(null, false, {message: 'No User Found' });

        bcrypt.compare(password, user.password, (err, matched)=>{
            if(err) return err;

            if(matched) {
                return done(null, user)
            }else {
                return done(null, false, {message: 'Incorrect passwor'});
            }
        });
    }); 
}));
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

router.get('/login', (req,res) => {
    res.render('home/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true,
        
    })(req, res, next);
});

//Logout
router.get('/logout', (req, res)=> {
    req.logOut();
    res.redirect('/login');
});

router.get('/register', (req,res) => {
    res.render('home/register');
});

router.post('/register', (req,res) => {
    let errors = [];

     
    //ERROR MESSAGES
    if (!req.body.firstName) {
        errors.push({ message: 'please add a firstName' });
    }
    if (!req.body.lastName) {
        errors.push({ message: 'please add a lastName' });
    }
    if (!req.body.email) {
        errors.push({ message: 'please add a email' });
    }
    if (!req.body.password) {
        errors.push({ message: 'please add a password' });
    }
    if (req.body.password !== req.body.passwordConfirm) {
        errors.push({ message: 'Passwords Dont match' });
    }

    if (errors.length > 0) {
        res.render('home/register', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        });
    }else{
        User.findOne({email: req.body.email}).then(user => {
            if(!user){
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                });
        
        
                bcrypt.genSalt(10, (err, salt)=> {
                    bcrypt.hash(newUser.password, salt, (err,hash)=> {
                        newUser.password = hash;
                        
                        newUser.save().then(savedUser => {
                            req.flash('success_message', 'You are now registered, please Login');
                            res.redirect('/login');
                        });
                    });
                });
            }else {
                req.flash('error_message', 'account exists');
                res.redirect('/login');
            }
        });
    }
});

router.get('/post/:slug', (req,res)=>{
    Post.findOne({slug:req.params.slug})
    .populate({path:'comments', match: {approveComment: true}, populate: {path: 'user', model: 'users'}})
    .populate('user')
    .then((post) => {
        Category.find({}).then(categories => {
            res.render('home/post', {post: post, categories:categories});  
        });
    }).catch((err)=>{
        if(err) throw err;
    });
});
module.exports = router;
 
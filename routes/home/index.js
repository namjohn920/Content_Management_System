const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
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
    Post.find({}).then((posts)=>{
        Category.find({}).then(categories => {
            res.render('home/index', {posts: posts, categories:categories});  
        });
    }).catch(err => {
        if(err) throw err;
    });
});

router.get('/login', (req,res) => {
    res.render('home/login');
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

router.get('/post/:id', (req,res)=>{
    Post.findOne({_id:req.params.id}).then((post) => {
        Category.find({}).then(categories => {
            res.render('home/post', {post: post, categories:categories});  
        });
    }).catch((err)=>{
        if(err) throw err;
    });
});

module.exports = router;
 
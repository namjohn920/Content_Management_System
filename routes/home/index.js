const express = require('express');
const router = express.Router();
const Post = require('../../models/Posts'); 
const Category = require('../../models/Category');

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

router.get('/post', (req,res)=>{
    res.render('home/post');
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
 
const express = require('express');
const router = express.Router();
const faker = require('faker');
const Post = require("../../models/Posts");
const Category = require("../../models/Category");
const Comment = require("../../models/Comment");
const {userAuthenticated} = require('../../helpers/authentication');

//Routes
router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req,res) => {
    const promises = [
        Post.countDocuments().exec(),
        Category.countDocuments().exec(),
        Comment.countDocuments().exec(),
    ];
    Promise.all(promises).then(([postCount, categoryCount, commentCount])=> {
        res.render('admin/index', {postCount:postCount, categoryCount:categoryCount, commentCount:commentCount});
    });
});

router.post('/generate-fake-posts', (req, res)=> {
    for(let i=0; i< req.body.amount; i++){
        let post = new Post();

        post.title = faker.name.title();
        post.status = 'public' || 'private' || 'draft';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence();
        post.file = "http://vignette3.wikia.nocookie.net/gundam/images/6/66/Nu_Gundam_Photo3.jpg/revision/latest/scale-to-width-down/2000?cb=20101213134129"
        post.slug = faker.name.title();
        post.date = Date.now();
        post.save(function(err){
            if(err) throw err;
        });
    }
    res.redirect('/admin/posts');
});

module.exports = router;
 
const express = require('express');
const router = express.Router();
const faker = require('faker');
const Post = require("../../models/Posts");
const {userAuthenticated} = require('../../helpers/authentication');

//Routes
router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req,res) => {
    res.render('admin/index');
});

router.post('/generate-fake-posts', (req, res)=> {
    for(let i=0; i< req.body.amount; i++){
        let post = new Post();

        post.title = faker.name.title();
        post.status = 'public' || 'private' || 'draft';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence();
        post.file = "http://vignette3.wikia.nocookie.net/gundam/images/6/66/Nu_Gundam_Photo3.jpg/revision/latest/scale-to-width-down/2000?cb=20101213134129"
        post.date = Date.now();
        post.save(function(err){
            if(err) throw err;
        });
    }
    res.redirect('/admin/posts');
});

module.exports = router;
 
/////////////////////////////
/////ADMIN POST ROUTE FILE///
/////////////////////////////

const express = require('express');
const router = express.Router();
const Post = require('../../models/Posts');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');


//Routes
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Post.find({}).then(posts => {
        res.render('admin/posts', { posts: posts });
    });
});

router.get('/create', (req, res) => {
    res.render('admin/posts/create');
});

router.post('/create', (req, res) => {
    
    let filename = 'https://data.whicdn.com/images/310822942/superthumb.jpg?t=1523888483'

    if (!isEmpty(req.files)) {

        let file = req.files.file;
        filename = '/uploads/' + Date.now() + '-'+ file.name;

        file.mv('./public' + filename, (err) => {
            if (err) throw err;
        }); 
    }

    let allowComments = true;
    if (req.body.allowComments) {
        allowComments = true
    } else {
        allowComments = false;
    }

    const newPost = new Post({
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body,
        file:filename
    });

    newPost.save().then(savedPost => {
        req.flash('success_message', `Post ${savedPost.title} was created successfully`);
        res.redirect('/admin/posts');
    }).catch(err => {
        console.log(err, 'could not save post ');
    });
});

router.get('/edit/:id', (req, res) => {
    Post.findOne({ _id: req.params.id }).then(post => {
        res.render('admin/posts/edit', { post: post });
    });
});

router.put('/edit/:id', (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            let allowComments = true;
            if (req.body.allowComments) {
                allowComments = true
            } else {
                allowComments = false;
            }
            post.title = req.body.title;
            post.status = req.body.status;
            post.allowComments = allowComments;
            post.body = req.body.body;

            if (!isEmpty(req.files)) {
                let file = req.files.file;
                filename = '/uploads/' + Date.now() + '-'+ file.name;
                post.file = filename;
                file.mv('./public' + filename, (err) => {
                    if (err) throw err;
                }); 
            }
            post.save().then(() => {
                req.flash('success_message','Post was successfully updated');
                res.redirect('/admin/posts');
            });
        });
});

router.delete('/:id', (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            
            fs.unlink(uploadDir + post.file, (err)=>{
                req.flash('success_message','Post was successfully deleted');
                res.redirect('/admin/posts');
            }); 
            post.delete();
        });
        
});
module.exports = router;
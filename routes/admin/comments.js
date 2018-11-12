const express = require('express');
const router = express.Router();
const Post = require('../../models/Posts');
const Comment = require('../../models/Comment');
const Category = require('../../models/Category');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');
const {userAuthenticated} = require('../../helpers/authentication');


//Routes
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res)=> {
    Comment.find({user: req.user.id}).populate('user').then(comments => {
        res.render('admin/comments', {comments:comments});
    });
});

router.post('/', (req,res)=> {
    Post.findOne({_id: req.body.id}).then(post =>{
        const newComment = new Comment({
            user: req.user.id,
            body: req.body.body
        });
        post.comments.push(newComment);
        post.save().then(savedPost => {
            newComment.save().then(savedComment => {
                res.redirect(`/post/${post.id}`);
            });
        });
    });
});

router.delete('/:id', (req,res)=> {
    Comment.deleteOne({_id: req.params.id}).then(deleteItem=>{

        Post.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}}, (err, data)=>{

           if(err) console.log(err);

            res.redirect('/admin/comments');

              });

        });
});

module.exports = router;
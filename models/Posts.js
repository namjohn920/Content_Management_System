const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const Schema = mongoose.Schema;


const PostSchema = new Schema({

    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    user: {
        type:Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type:String,
        required: true,
    },
    status: {
        type:String,
        default: 'public'
    },
    allowComments: {
        type: Boolean,
        default: true,
        required: true
    },
    body: {
        type:String,
        required: true
    },
    file :{
        type: String
    },
    date: {
        type: Date,
    },
    slug: {
        type: String,

    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]
});
PostSchema.plugin(URLSlugs('title', {field: 'slug'}));
module.exports = mongoose.model('Post', PostSchema);

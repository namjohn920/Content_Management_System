const mongoose = require('mongoose');

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
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]
});
module.exports = mongoose.model('Post', PostSchema);

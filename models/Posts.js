const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const PostSchema = new Schema({
    user: {
        type:String
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
    }
});
module.exports = mongoose.model('Post', PostSchema);

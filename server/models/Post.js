const { Schema, model } = require('../config/database');
const { ObjectId } = Schema;

const postSchema = new Schema({
    title: {
        type: String,
        unique: true,
    },
    subtitle: {
        type: String,
    },
    body: {
        type: String,
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
},
{
    timestamps : true
});

const Post = model('Post', postSchema);

module.exports = Post;
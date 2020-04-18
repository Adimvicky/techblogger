const { Schema, model } = require('../config/database');
const { ObjectId } = Schema;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
    },
    posts : [
        {
            type : Schema.Types.ObjectId,
            ref : "Post"
        }
    ]
});


const User = model('User', userSchema);

module.exports = User;
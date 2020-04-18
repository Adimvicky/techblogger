const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.db.url,{
    useNewUrlParser : true,
    useCreateIndex : true
},(err) => {
    if(!err){
        console.log(config.db.url)
        return console.log('Database connection established');
    }
    console.log('Database connection failed => ',err);
});

module.exports = mongoose;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportMongo = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    }
});
userSchema.plugin(passportMongo);

module.exports = mongoose.model('User' , userSchema)
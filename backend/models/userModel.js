const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    confirmPassword : {
        type : String,
        required : true,
        select : false
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

const UserCollection = new mongoose.model('UserCollection', userSchema)

module.exports = UserCollection
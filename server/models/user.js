let mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    password: String,    
    creationDate: Date,
    profileImage: {type: String, required: false, default: "https://randomuserprofile.github.io/logo.png"},
    favouriteCards: {type:Array, required: false, default: []},
    createdDecks: {type:Array, required: false, default: []}
})

module.exports = mongoose.model('User', userSchema)
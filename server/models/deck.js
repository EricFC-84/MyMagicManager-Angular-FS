let mongoose = require('mongoose')

let deckSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,   
    creationDate: Date,
    updateDate: Date,
    cards: {type:Array, required: false, default: []},
    public: {type:Boolean, required: true, default: true},
    creator: {
        _id: mongoose.Schema.Types.ObjectId,
        name: String
    }
})

module.exports = mongoose.model('Deck', deckSchema)
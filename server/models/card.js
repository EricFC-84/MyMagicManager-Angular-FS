let mongoose = require('mongoose')

let cardSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    set_name: String,
    set: String,
    oracle_text: String,
    flavor_text: String,
    mana_cost: String,
    cmc: Number,
    colors: Array,
    color_identity: Array,
    rarity: String,
    type_line: String,
    power: String,
    toughness: String,
    image_uris: {
        type: {
            small: String,
            normal: String,
            large: String,
            png: String,
            art_crop: String,
            border_crop: String
        },
        required: false
    },
    artist: String,
    card_faces: {
        type: Array,
        required: false
    },
    released_at: String,
    promo: Boolean,
    prices: String,
    purchase_uris: {
        tcgplayer: String,
        cardmarket: String,
        cardhoarder: String
    },
    // legalities: Array //in Standard all legal. Modify in case we add all existing cards, not just standard

})

module.exports = mongoose.model('Card', cardSchema)
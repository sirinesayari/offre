const mongo = require ("mongoose");
const Schema =mongo.Schema 
const FeedBack = new Schema({
    
    texte: String ,
    interview: {
        type: Schema.Types.ObjectId,
        ref: 'Interview' 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongo.model("feedBack", FeedBack) ;
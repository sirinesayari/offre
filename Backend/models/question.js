// const mongoose = require('mongoose');
// const Schema = mongoose.Schema
// const question = new Schema(
//     {
//         text:String,
//         options:String,
//         correctOption:Number
       
//     }
// )
// module.exports = mongoose.model("question", question);// model(name in the db, name of schema)

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOption: { type: Number, required: true },
    thematique: [{ type: String, required: true }],
    niveau: [{ type: String, required: true }],

  });
const Question = mongoose.model('Question', questionSchema);

module.exports = Question;

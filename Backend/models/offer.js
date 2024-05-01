const mongoose = require("mongoose");

const { boolean } = require("yup");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Offer = new Schema({

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  skills: String,
  location: String,
  salary: Number,
  experienceLevel: String,
  offerType: {
    type: String,
    enum: ["emploi", "stage"], // Example job types
  },
  publicationDate: {
    type: Date,
    default: Date.now,
  },
  expirationDate: Date,
  file: String,
  pdf:String,
  contractType: {
    type: String,
    enum: ["CDI", "CDD", "freelance", "stage"], // Example contract types
  },
  internshipDuration: {
    type: String,
  },
  comments: [CommentSchema],
  likes: [String],
  quiz: {
    type: Boolean,
    default: false
  },
  archived: {
    type: Boolean,
    default: false
  },
  user:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  }
});

module.exports = mongoose.model("offer", Offer);



const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  image: {
    type: String, // Vous pouvez ajuster le type en fonction de vos besoins, par exemple String pour l'URL de l'image ou Buffer pour stocker l'image directement
    required: false // L'image peut être facultative, selon vos besoins
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [
    {
      userId: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      }
    }
  ]
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

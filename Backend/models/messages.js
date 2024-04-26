const mongo = require("mongoose");
const Schema = mongo.Schema;

const MessageSchema = new Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
    reactions: [{
      type: String, // Assuming reactions are stored as strings (e.g., "👍", "❤️", "😂")
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongo.model("Message", MessageSchema); // Utilisation de "Message" pour le modèle




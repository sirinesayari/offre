const mongo=require("mongoose")
const Schema = mongo.Schema 
const Chat=new Schema(
    {
        members: {
          type: Array,
        },
      },
      {
        timestamps: true,
      }
    );




module.exports = mongo.model("chat", Chat) ; 
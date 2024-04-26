const Chat = require("../models/chat")

async function getall (req,res){
    try{
        const data = await Chat.find();
       
        res.status(200).send(data)
        }catch(err){
            res.status(400).send(err);
        }
}
async function add (req, res){
    try{
    console.log('data',req.body.name)
    const chat = new Chat(req.body)
    await chat.save();
    res.status(200).send("add good")
    }catch(err){
        res.status(400).send({error : err});
        console.log()
    }
}

async function getid (req,res){
    try{
        const data = await Chat.findById(req.params.id);
       
        res.status(200).send(data)
        }catch(err){
            res.status(400).send(err);
        }
}

async function getbynameChat(req,res){
    try{
        let name = req.params.nameChat;
        const dataname = await Chat.findOne({name});
       
        res.status(200).send(dataname)
        }catch(err){
            res.status(400).send( err);
        }
}

async function UpdateChatRoom(req, res){
    try {
       await Chat.findByIdAndUpdate(req.params.id, req.body);
       res.status(200).send("data updated")

    } catch (err) {
        res.status(400).json(err);
    }
}
async function deleteChatRoom (req, res) {
    try {
       await Chat.findByIdAndDelete(req.params.id);
       res.status(200).send("ChatRoom deleted")

    } catch (err) {
        res.status(500).json(err);
    }
}


 async function createChat (req, res) {
    const newChat = new Chat({
      members: [req.body.senderId, req.body.receiverId],
    });
    try {
      const result = await newChat.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
  async function userChats (req, res) {
    try {
      const chat = await Chat.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
 async function findChat (req, res)  {
    try {
      const chat = await Chat.findOne({
        members: { $all: [req.params.firstId, req.params.secondId] },
      });
      res.status(200).json(chat)
    } catch (error) {
      res.status(500).json(error)
    }
  };
module.exports={getall , getid, getbynameChat,findChat,userChats,createChat, add , UpdateChatRoom ,deleteChatRoom}

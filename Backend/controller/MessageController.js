const MessageModel = require("../models/messages")

async function getall (req,res){
    try{
        const data = await MessageModel.find();
       
        res.status(200).send(data)
        }catch(err){
            res.status(400).send(err);
        }
}

async function add(req, res) {
    try {
        console.log('data', req.body.name); // Assuming you're logging the 'name' field from the request body
        const message = new MessageModel(req.body); // Assuming req.body contains the necessary fields for a message
        await message.save(); // Save the message to the database
        res.status(200).send("Message added successfully");
    } catch (err) {
        console.error('Error adding message:', err.message); // Log the error message for debugging
        res.status(400).send({ error: err.message }); // Send error message in response
    }
}




async function getidM (req,res){
    try{
        const data = await MessageModel.findById(req.params.id);
       
        res.status(200).send(data)
        }catch(err){
            res.status(400).send(err);
        }
}


async function getbyDate(req,res){
    try{
        let date = req.params.sendDate;
        const dataname = await MessageModel.findOne({date});
       
        res.status(200).send(dataname)
        }catch(err){
            res.status(400).send( err);
        }
}

async function getMessagesByChatId(req, res) {
    try {
        const chatId = req.params.chatId;
        const messages = await MessageModel.find({ chat: chatId }).populate('sender');

        if (!messages) {
            return res.status(404).send("No messages found for this chat");
        }

        res.status(200).json(messages);
    } catch (err) {
        console.error('Error fetching messages by chat ID:', err.message);
        res.status(500).json({ error: err.message });
    }
}




async function UpdateMessage(req, res){
    try {
       await MessageModel.findByIdAndUpdate(req.params.id, req.body);
       res.status(200).send("data updated")

    } catch (err) {
        res.status(400).json(err);
    }
}
async function deleteMessage (req, res) {
    try {
       await MessageModel.findByIdAndDelete(req.params.id);
       res.status(200).send("Message deleted")

    } catch (err) {
        res.status(500).json(err);
    }
}

async function addMessage  (req, res)  {
    const { chatId, senderId, text } = req.body;
    const message = new MessageModel({
      chatId,
      senderId,
      text,
    });
    try {
      const result = await message.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
  async function  getMessages(req, res)  {
    const { chatId } = req.params;
    try {
      const result = await MessageModel.find({ chatId });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  async function reactToMessage(req, res) {
    try {
        const messageId = req.params.messageId; // Assuming the message ID is passed in the request params
        const reaction = req.body.reaction; // Assuming the reaction is passed in the request body

        // Find the message by its ID
        const message = await MessageModel.findById(messageId);

        if (!message) {
            return res.status(404).send("Message not found");
        }

        // Add the reaction to the message
        message.reactions.push(reaction);

        // Save the updated message
        await message.save();

        res.status(200).send("Message reacted successfully");
    } catch (err) {
        console.error('Error reacting to message:', err.message);
        res.status(400).send({ error: err.message });
    }
}

async function unreactToMessage(req, res) {
    try {
        const messageId = req.params.messageId; // Assuming the message ID is passed in the request params
        const reaction = req.body.reaction; // Assuming the reaction is passed in the request body

        // Find the message by its ID
        const message = await MessageModel.findById(messageId);

        if (!message) {
            return res.status(404).send("Message not found");
        }

        // Remove the reaction from the message
        const reactionIndex = message.reactions.indexOf(reaction);
        if (reactionIndex !== -1) {
            message.reactions.splice(reactionIndex, 1);
        }

        // Save the updated message
        await message.save();

        res.status(200).send("Message unreacted successfully");
    } catch (err) {
        console.error('Error unreacting to message:', err.message);
        res.status(400).send({ error: err.message });
    }
}


module.exports={getall , getidM, getbyDate, add ,getMessagesByChatId, getMessages,addMessage,UpdateMessage,deleteMessage}



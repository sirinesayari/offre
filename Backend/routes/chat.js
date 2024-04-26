const express = require ("express");
const router=express.Router()
const Chat= require("../models/chat")
const chatController = require("../controller/ChatRoomController");
router.get('/', function(req,res){
    res.send('Liste des salles de discussion');
});

router.get('/:nameChat/:NbParticipantsChat/:dateCreationChat', function(req,res){
    // Instanciation de la salle de discussion
    new Chat ({
        nameChat: req.params.nameChat,
        NbParticipants: req.params.NbParticipantsChat,
        dateCreationChat: req.params.dateCreationChat // Ajout de la date de création
    }).save();

    res.send("Salle de discussion créée avec succès !");
});
//postman

//router.post("/add",chatController.add);


router.get('/getall' ,chatController.getall);
router.get('/getid/:id' ,chatController.getid);

router.get('/getbynameChat/:name' ,chatController.getbynameChat);
router.put('/updateChatRoom/:id', chatController.UpdateChatRoom);

router.delete('/deleteChatRoom/:id',chatController.deleteChatRoom);




router.post('/', chatController.createChat);
router.get('/:userId', chatController.userChats);
router.get('/find/:firstId/:secondId', chatController.findChat);

module.exports = router ;
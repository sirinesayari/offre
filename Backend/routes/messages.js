
const express = require("express");
const router = express.Router();
const Messages = require("../models/messages");
const messageController = require("../controller/MessageController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../images/")); // Corriger le chemin de destination
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Nom du fichier
    },
});

// Initialisation de multer avec la configuration de stockage
const upload = multer({ storage: storage });

// Route pour gérer l'upload de fichiers
router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("Aucun fichier n'a été téléchargé.");
    }
    res.send(req.file.filename); // Renvoyer le nom du fichier téléchargé
});




//postman
router.post("/add",messageController.add);

router.get('/getall' ,messageController.getall);
router.get('/getidM/:id' ,messageController.getidM);

router.get('/getMessage/:chatId', async function (req, res) {
    try {
        const chatId = req.params.chatId;
        // Fetch the message by chat ID from the database
        const message = await Messages.findOne({ chat: chatId });
        if (!message) {
            // If no message is found, send a 404 response
            return res.status(404).send("Message not found");
        }
        // If the message is found, send it as a response
        res.json(message);
    } catch (error) {
        // If an error occurs, send a 500 response with the error message
        console.error("Error fetching message:", error);
        res.status(500).send("Internal Server Error");
    }
});



router.get('/getbyDate/:date' ,messageController.getbyDate);
router.put('/updateMessage/:id', messageController.UpdateMessage);

router.delete('/deleteMessage/:id',messageController.deleteMessage);



router.post('/', messageController.addMessage);

router.get('/:chatId', messageController.getMessages);



module.exports = router ;
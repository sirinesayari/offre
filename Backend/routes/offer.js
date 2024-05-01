const express = require("express");
const router = express.Router();
const Offer = require("../models/offer");
const offerController = require("../controller/OffersController");
const validate = require("../middl/validate");
const Notification = require('../models/notification');
const Email = require('../models/emailoffre'); // Importez votre modèle Email
require('dotenv').config();
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const app = express();

//const upload = require("../config/multer");
const multer = require("multer");
const PDFDocument = require('pdfkit');
const fs = require('fs');
// Remplacez ces valeurs par vos identifiants Twilio
const TWILIO_SID = 'AC0ebba4da9a551141e04dc3d66ab2a8a5';
const TWILIO_AUTH_TOKEN = 'cf5edb09eb7bb7e3da63bb244b3c0a51';
const PHONE_NUMBER = '+18456227254' ; // Votre numéro Twilio
// Configuration du client Twilio
const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);




const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "uploads/"); // Spécifiez le répertoire de destination où les fichiers seront stockés
        },
        filename: function (req, file, cb) {
          cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));        },
      });
// Initialiser l'upload avec multer
const upload = multer({ storage: storage });    

router.get('/', function(req, res) {
    res.send("Hello Offer");
});

// Route pour envoyer un SMS
router.post('/send-sms', async (req, res) => {
  const { recipientNumber, message } = req.body;
  
  console.log(`Trying to send SMS to ${recipientNumber} with message: ${message}`); // Ajout de logs
  
  try {
   
    const formattedNumber = `+216${recipientNumber}`;
    const isValidNumber = PhoneNumber.isValidNumber(formattedNumber, 'TN');

    if (!isValidNumber) {
      throw new Error('Invalid phone number');
    }
    await client.messages.create({
      body: message,
      from: PHONE_NUMBER,
      to: formattedNumber
    });
    res.status(200).send("SMS envoyé avec succès !");
  } catch (error) {
    console.error("Error sending SMS:", error);
    // Envoyer une réponse d'erreur
    res.status(500).send("Erreur lors de l'envoi du SMS.");
  }
});

//pdf
router.get('/generate-pdf', async (req, res) => {
  try {
    const doc = new PDFDocument();
    const filePath = 'offers.pdf';
    doc.fontSize(20).text('Liste des Offres', 100, 50);
    const offers = await Offer.find();
    const tableHeaders = [ 'Titre','Compétences', 'Lieu', 'Salaire', 'Niveau d\'expérience'];
    let tableY = 150;
    tableHeaders.forEach((header, index) => {
      doc.fontSize(12).text(header, 100 + index * 100, tableY);
    });
    tableY += 20;
    offers.forEach((offer) => {
      const offerData = [
        offer.title ? offer.title : '',
        offer.skills ? offer.skills : '',
        offer.location ? offer.location : '',
        offer.salary ? offer.salary.toString() : '',
        offer.experienceLevel ? offer.experienceLevel : ''
      ];
      let dataX = 100;
      offerData.forEach((data, index) => {
        doc.fontSize(10).text(data.toString(), 100 + index * 100, tableY);
      });
      tableY += 20;
    });
    const stream = doc.pipe(fs.createWriteStream(filePath));
    doc.end();
    stream.on('finish', () => {
      res.download(filePath, (err) => {
        if (err) {
          console.error('Erreur lors du téléchargement du fichier PDF:', err);
          res.status(500).send('Erreur lors du téléchargement du fichier PDF');
        } else {
          console.log('Fichier PDF téléchargé avec succès');
          fs.unlinkSync(filePath); // Supprimer le fichier PDF après le téléchargement
        }
      });
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF. Please try again.");
  }
});

// statistic

router.get('/statistics', async (req, res) => {
  try {
    const offersWithQuiz = await Offer.countDocuments({ quiz: true });
    const offersWithoutQuiz = await Offer.countDocuments({ quiz: false });

    res.status(200).json({
      offersWithQuiz: offersWithQuiz,
      offersWithoutQuiz: offersWithoutQuiz
    });
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).send("Error getting statistics. Please try again.");
  }
});
router.post("/add", upload.fields([
    { name: "file", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
]), validate, async (req, res) => {
    try {
      console.log(req);
        const { title, description, skills, location, salary, experienceLevel, offerType, expirationDate, contractType, internshipDuration ,quiz,user} = req.body;
        
        // Vérifier si un fichier a été téléchargé
        let file = "";
        if (req.files["file"] && req.files["file"][0]) {
            file = req.files["file"][0].path;
            console.log(req.files["file"][0].path);
        }

        let pdf = "";
        if (req.files["pdf"] && req.files["pdf"][0]) {
            pdf = req.files["pdf"][0].path;
            console.log(req.files["pdf"][0].path);
        }

        // Vérifier si tous les champs requis sont fournis
        if (!title ) { 
            return res.status(400).send("Title are required.");
        }
        
        // Créer une nouvelle instance d'Offre
        const newOffer = new Offer({
            title,
            description,
            skills,
            location,
            salary,
            experienceLevel,
            offerType,
            expirationDate,
            contractType,
            internshipDuration,
            quiz,
            user,
            file,
            pdf
             // Inclure le nom de fichier uniquement s'il a été téléchargé
        });

        // Sauvegarder l'Offre dans la base de données
        await newOffer.save();
        return res.status(200).send("Offer added successfully.");
    } catch (error) {
        console.error("Error adding offer:", error);
        return res.status(500).send("Error adding offer. Please try again.");
    }
});
// Route pour télécharger et stocker un fichier associé à une offre
const path = require('path');
const offer = require("../models/offer");
router.get('/uploads/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '..', 'uploads', fileName);
  res.sendFile(filePath);
  });

router.get('/getall', offerController.getAllOffers);
router.get('/get/:id', offerController.getOfferById);

router.put('/updateOffer/:id', validate, offerController.updateOffer);

router.delete('/deleteOffer/:id', offerController.deleteOffer);

// Nouvelles routes pour archiver les offres
router.put('/:id/archive', offerController.archiveOffer);
router.put('/:id/archiveExpired', offerController.archiveExpiredOffer);
router.put('/:id/unarchive', offerController.unarchiveOffer);
router.get('/archived', offerController.getArchivedOffers);


// Route pour ajouter un commentaire à une offre spécifique
router.post("/:offerId/comment/add/:userId", offerController.addComment);

// Route pour mettre à jour un commentaire spécifique associé à une offre
router.put("/:offerId/comment/:commentId/update",  offerController.updateComment);

// Route pour supprimer un commentaire spécifique associé à une offre
router.delete("/:offerId/comment/:commentId/delete/:userId", offerController.deleteComment);

router.get('/:offerId/comments', offerController.getCommentsByOfferId);
// Routes pour les likes
router.post("/:offerId/like/:userId", offerController.addLike);
router.delete('/:id/unlike/:userId', offerController.removeLike);
router.get('/:id/like/:userId', offerController.getLike);
router.get('/notification/:userId', offerController.getNotifications);
router.delete('/deleteNotification/:id', offerController.deleteNotificationById);
router.put('/updateNotification/:id', offerController.UpdateNotificationById);

router.get("/statistics-by-type", offerController.getStatisticsByType);



module.exports = router;
// config/multer.js
const multer = require("multer");

// Configuration de Multer pour gérer les fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Répertoire où les fichiers seront sauvegardés
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Nom du fichier sauvegardé
  }
});

// Créer une instance de Multer avec la configuration de stockage
const upload = multer({ storage: storage });

module.exports = upload;

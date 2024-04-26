const express = require("express");
const router = express.Router();
const Candidature = require("../models/candidature");
const Offre = require("../models/offer");
const upload = require("../config/multer");
const twilio = require('twilio');

router.post("/add/:selectedOffer/:userId", upload.fields([
  { name: "lettreMotivation", maxCount: 1 },
  { name: "cv", maxCount: 1 }
]), async (req, res) => {
  try {
    const { nom, email, specialite} = req.body;
    const selectedOfferid = req.params.selectedOffer;
    const userId = req.params.userId;
    // Vérifier si tous les champs sont renseignés
    if (!nom || !email || !specialite || !req.files["lettreMotivation"] || !req.files["cv"] || !selectedOfferid) {
      return res.status(400).send("Tous les champs sont obligatoires.");
    }

    // Ajouter la candidature à la base de données avec la référence à l'offre
    const candidature = await Candidature.create({ 
      nom, 
      email, 
      specialite, 
      lettreMotivation: req.files["lettreMotivation"][0].originalname, 
      cv: req.files["cv"][0].originalname, 
      offre: selectedOfferid ,
      user:userId
    });

    res.status(200).json(candidature);
  } catch (error) {
    console.error("Error adding candidature:", error);
    res.status(500).send("Erreur lors de l'ajout de la candidature. Veuillez réessayer.");
  }
});


// Ajouter une route pour récupérer les candidatures par offre
router.get("/by-offre/:offreId", async (req, res) => {
  try {
    const offreId = req.params.offreId;
    const candidatures = await Candidature.find({ offre: offreId });
    res.status(200).json(candidatures);
  } catch (error) {
    console.error("Error fetching candidatures by offre:", error);
    return res.status(500).send("Erreur lors de la récupération des candidatures. Veuillez réessayer.");
  }
});

router.get("/candidatures/:offreId", async (req, res) => {
  try {
    const offreId = req.params.offreId;
    const candidatures = await Candidature.find({ offre: offreId });
    res.status(200).json(candidatures);
  } catch (error) {
    console.error("Error fetching candidatures by offre:", error);
    return res.status(500).send("Erreur lors de la récupération des candidatures. Veuillez réessayer.");
  }
});

// Route pour accepter une candidature
// router.post('/offer/:offerId/candidature/:candidatureId/accept', async (req, res) => {
//   try {
//     const { offerId, candidatureId } = req.params;
//     // Effectuez les opérations nécessaires pour accepter la candidature
//     // Mettez à jour le statut de la candidature dans la base de données, par exemple
//     await Candidature.findByIdAndUpdate(candidatureId, { status: 'accepted' });
//     res.status(200).send("Candidature acceptée avec succès");
//   } catch (error) {
//     console.error("Erreur lors de l'acceptation de la candidature :", error);
//     res.status(500).send("Une erreur s'est produite lors de l'acceptation de la candidature");
//   }
// });

// Route pour refuser une candidature
router.post('/offer/:offerId/candidature/:candidatureId/reject', async (req, res) => {
  try {
    const { offerId, candidatureId } = req.params;
    // Effectuez les opérations nécessaires pour refuser la candidature
    // Mettez à jour le statut de la candidature dans la base de données, par exemple
    await Candidature.findByIdAndUpdate(candidatureId, { status: 'rejected' });
    res.status(200).send("Candidature refusée avec succès");
  } catch (error) {
    console.error("Erreur lors du refus de la candidature :", error);
    res.status(500).send("Une erreur s'est produite lors du refus de la candidature");
  }
});


// Route pour accepter ou refuser une candidature
router.post('/:offerId/candidature/:candidatureId/:status', async (req, res) => {
  const { offerId, candidatureId, status } = req.params;

  try {
    // Recherche de la candidature correspondante à l'ID fourni
    const candidature = await Candidature.findById(candidatureId);

    if (!candidature) {
      return res.status(404).json({ message: "Candidature not found" });
    }

    // Vérification que la candidature appartient à l'offre spécifiée
    if (candidature.offer.toString() !== offerId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Mettre à jour le statut de la candidature
    candidature.status = status;
    await candidature.save();

    res.status(200).json({ message: "Candidature updated successfully", candidature });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route pour archiver une candidature
router.post('/offer/:offerId/candidature/:candidatureId/archive', async (req, res) => {
  try {
    const { offerId, candidatureId } = req.params;
    
    // Effectuez les opérations nécessaires pour archiver la candidature
    // Par exemple, mettez à jour le statut de la candidature dans la base de données
    
    // Supposez que vous avez un modèle Candidature avec une propriété 'status'
    // Vous pouvez mettre à jour le statut de la candidature à 'archived' ainsi :
    await Candidature.findByIdAndUpdate(candidatureId, { status: 'archived' });
    
    res.status(200).send("Candidature archivée avec succès");
  } catch (error) {
    console.error("Erreur lors de l'archivage de la candidature :", error);
    res.status(500).send("Une erreur s'est produite lors de l'archivage de la candidature");
  }
});

router.get('/archived', async (req, res) => {
  try {
    // Recherche des candidatures archivées dans la base de données
    const archivedCandidatures = await Candidature.find({ status: 'archived' });

    // Envoi des candidatures archivées en tant que réponse
    res.json(archivedCandidatures);
  } catch (error) {
    // Gestion des erreurs
    console.error("Erreur lors de la récupération des candidatures archivées :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des candidatures archivées" });
  }
});

router.get('/accepted', async (req, res) => {
  try {
    // Recherche des candidatures acceptées dans la base de données
    const acceptedCandidatures = await Candidature.find({ status: 'accepted' });

    // Envoi des candidatures acceptées en tant que réponse
    res.json(acceptedCandidatures);
  } catch (error) {
    // Gestion des erreurs
    console.error("Erreur lors de la récupération des candidatures acceptées :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des candidatures acceptées" });
  }
});


// Route pour désarchiver une candidature
// Endpoint pour désarchiver une candidature
router.post('/:id/unarchive', async (req, res) => {
  const candidatureId = req.params.id;

  try {
    // Recherche de la candidature dans l'état archivé
    const candidature = await Candidature.findOneAndUpdate(
      { _id: candidatureId, status: 'archived' },
      { status: 'pending' }, // Mettre à jour le statut de 'archived' à 'active'
      { new: true }
    );

    // Vérification si la candidature a été trouvée et mise à jour
    if (!candidature) {
      return res.status(404).json({ message: 'Candidature not found or already unarchived' });
    }

    // Envoyer une réponse réussie
    res.status(200).json({ message: 'Candidature successfully unarchived', candidature });
  } catch (error) {
    console.error('Error unarchiving candidature:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint pour récupérer les candidatures d'un candidat spécifique
// router.get("/candidat", async (req, res) => {
//   const candidatId = req.user.id; // Supposons que l'ID du candidat est stocké dans req.user.id après l'authentification
//   try {
//     // Récupérer les candidatures associées à l'ID du candidat
//     const candidatures = await Candidature.find({ candidat: candidatId }).populate("offre", "titre"); // Assurez-vous que le champ "candidat" dans le modèle Candidature correspond à l'ID du candidat
//     res.json(candidatures);
//   } catch (error) {
//     console.error("Erreur lors de la récupération des candidatures du candidat:", error);
//     res.status(500).json({ message: "Erreur lors de la récupération des candidatures du candidat." });
//   }
// });

// Exemple de middleware d'authentification (à titre d'illustration)
const authMiddleware = (req, res, next) => {
  // Simuler l'authentification réussie pour l'utilisateur avec un ID statique
  req.user = {
      id: '123456789', // ID de l'utilisateur authentifié
      // Autres informations d'identification de l'utilisateur peuvent être ajoutées ici
  };
  next();
};
router.get('/statistics', async (req, res) => {
  try {
    const acceptedCount = await Candidature.countDocuments({ status: 'accepted' });
    const rejectedCount = await Candidature.countDocuments({ status: 'rejected' });
    const pendingCount = await Candidature.countDocuments({ status: 'pending' });
    const archivedCount = await Candidature.countDocuments({ status: 'archived' });

    res.json({
      accepted: acceptedCount,
      rejected: rejectedCount,
      pending: pendingCount,
archived: archivedCount,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'An error occurred while fetching statistics' });
  }
});
// Exemple de route pour accéder aux candidatures de l'utilisateur
router.get('/candidat', authMiddleware, async (req, res) => {
  try {
      // Récupérer l'ID de l'utilisateur authentifié depuis req.user.id
      const candidatId = req.user.id;

      // Utiliser l'ID de l'utilisateur pour récupérer ses candidatures depuis la base de données
      const candidatures = await Candidature.find({ candidat: candidatId });

      // Envoyer les candidatures de l'utilisateur en réponse
      res.json(candidatures);
  } catch (error) {
      console.error('Erreur lors de la récupération des candidatures de l\'utilisateur :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des candidatures de l\'utilisateur' });
  }
});




// Route pour accepter une candidature
router.post('/offer/:offerId/candidature/:candidatureId/accept', async (req, res) => {
  try {
  const { candidatureId, offerId } = req.body;
  await Candidature.findByIdAndUpdate(candidatureId, { status: 'accepted' });

  // Votre logique pour accepter la candidature
  // Par exemple, mise à jour dans la base de données, etc.

  // Envoyer une réponse réussie
  res.status(200).send("Candidature acceptée avec succès !");
} catch (error) {
  console.error("Erreur lors de l'acceptation de la candidature :", error);
  res.status(500).send("Une erreur s'est produite lors du refus de la candidature");
}
});




router.get('/generate-pdf', (req, res) => {
  const doc = new PDFDocument();
  const filePath = 'exemple.pdf';

  // Ajouter du contenu au PDF
  doc.fontSize(20).text('Exemple de PDF temporaire', 100, 100);

  // Enregistrer le PDF sur le disque
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
});

// Récupérer les candidatures d'un utilisateur spécifique
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const candidatures = await Candidature.find({ userId }); // Supposons que userId soit le champ correspondant à l'utilisateur dans le modèle Candidature
    res.json(candidatures);
  } catch (error) {
    console.error("Error fetching candidatures:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
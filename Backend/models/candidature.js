const mongoose = require("mongoose");

const CandidatureSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Assure que chaque email est unique
  },
  specialite: {
    type: String,
    required: true
  },
  lettreMotivation: {
    type: String,
    required: true
  },
  cv: {
    type: String,
    required: true
  },
  offre: { // Champ pour stocker l'ID de l'offre associée
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer', // Référence au modèle Offer
    required: true
  },
  user: { // Champ pour stocker l'ID de l'offre associée
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Référence au modèle Offer
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'archived'], // Statuts possibles
    default: 'pending', // Statut par défaut
  },

});

module.exports = mongoose.model("Candidature", CandidatureSchema);

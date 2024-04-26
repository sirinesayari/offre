const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], // Référence aux questions associées
  //createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Référence à l'utilisateur qui a créé le quiz
  createdAt: { type: Date, default: Date.now },
  // Ajoutez d'autres attributs selon les besoins, comme les scores, les statistiques, etc.
  offreId: { // Champ pour stocker l'ID de l'offre associée
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer', // Référence au modèle Offer
  },
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
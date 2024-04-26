const express = require("express");
const Question = require("../models/question");
const nodemailer = require('nodemailer'); // Importer nodemailer
const quiz = require("../models/quiz");

const router = express.Router();

// Définir le transporter pour l'envoi d'e-mails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "farahtelly@gmail.com",
    pass: "qayv oufk bfup ywhc",
  },
});

router.get("/generate/:niveau/:thematique/:offerId", async (req, res) => {
  const niveau = req.params.niveau;
  const thematique = req.params.thematique;
  const offerId = req.params.offerId;

  try {
    // Vérifier si les paramètres requis sont présents
    if (!niveau || !thematique || !offerId) {
      return res.status(400).json({ error: 'Les paramètres niveau, thématique et offerId sont obligatoires.' });
    }

    // Récupérer les questions correspondantes depuis la base de données
    const questions = await Question.find({ niveau, thematique });

    // Vérifier si des questions ont été trouvées
    if (questions.length === 0) {
      return res.status(404).json({ error: 'Aucune question trouvée pour les critères spécifiés.' });
    }

    // Mélanger les questions pour obtenir un quiz aléatoire
    const shuffledQuestions = shuffleArray(questions);

    // Sélectionner un nombre spécifique de questions pour le quiz
    const numberOfQuestionsInQuiz = 10; // You can adjust the number of questions
    const quizQuestions = shuffledQuestions.slice(0, numberOfQuestionsInQuiz);

    // Create the quiz document with correct offerId and question references
    const quizOffer = new quiz({
      offreId: offerId, // Ensure that the field name matches the schema
      questions: quizQuestions.map(question => question._id), // Save only question ids in the quiz document
    });

    // Save the quiz to the database
    await quizOffer.save();

    // Envoyer les questions du quiz au client
    res.json(quizQuestions);
  } catch (error) {
    console.error('Erreur lors de la génération du quiz :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la génération du quiz' });
  }
});



// Function to shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Route pour envoyer un e-mail avec le quiz au candidat
router.post('/send-email', async (req, res) => {
  const { quiz, email } = req.body;

  // Composition de l'URL du quiz
  const quizUrl = 'http://localhost:3000/:niveau/:thematique/:offerId'; // Remplacez 'votre_domaine.com' par votre domaine réel
//quiz/getByOfferId
  // Composition du contenu de l'e-mail avec le quiz et l'URL
  const emailContent = `
  <h1>Quiz</h1>
  <p>Voici le lien pour passer le quiz :</p>
  <a href="${quizUrl}" target="_blank">Passer le Quiz</a>
  `;

  // Définition des options de l'e-mail
  const mailOptions = {
    from: 'farahtelly@gmail.com', // Votre adresse e-mail
    to: email, // Adresse e-mail du candidat
    subject: 'Quiz', // Sujet de l'e-mail
    html: emailContent, // Contenu de l'e-mail au format HTML
  };

  try {
    // Envoi de l'e-mail
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});
// Route pour afficher le quiz
router.get("/", async (req, res) => {
  try {
    // Récupérer les questions pour le quiz
    const questions = await Question.find();

    // Vérifier si des questions ont été trouvées
    if (questions.length === 0) {
      return res.status(404).json({ error: 'Aucune question trouvée.' });
    }

    // Envoyer les questions du quiz au client
    res.json(questions);
  } catch (error) {
    console.error('Erreur lors de la récupération du quiz :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du quiz' });
  }
});
module.exports = router;
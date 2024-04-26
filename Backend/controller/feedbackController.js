const Interview = require('../models/interview');
const FeedBack = require('../models/feedback');

// async function save(req, res){
//     try {
//         await FeedBack.create({ texte: req.body.text });
//         res.status(201).send('add good');
//     }catch (error) {
//         console.error('Erreur lors de l\'enregistrement de la transcription dans la base de données :', error);
//         res.status(500).send('Erreur lors de l\'enregistrement de la transcription dans la base de données.');
//     }
// };

async function save(req, res) {
    try {
        const { text, interviewId } = req.body;
        if (!text || !interviewId) {
            return res.status(400).send("Text and interviewId are required");
        }
        // Vérifiez si un feedback existe déjà pour cette interview
        const existingFeedback = await FeedBack.findOne({ interview: interviewId });
        if (existingFeedback) {
            return res.status(400).send("Feedback already exists for this interview");
        }
        const feedBack = await FeedBack.create({ texte: text, interview: interviewId });
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).send("Interview not found");
        }

        interview.feedbacks.push(feedBack._id);
        await interview.save();

        res.status(201).send('Feedback added successfully');
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getall (req, res){
    try {
      const transcriptions = await FeedBack.find();
      res.status(200).json(transcriptions);
    } catch (error) {
      console.error('Erreur lors de la récupération des transcriptions depuis la base de données :', error);
      res.status(500).send('Erreur lors de la récupération des transcriptions depuis la base de données.');
    }
};

async function deleteTranscription  (req, res)  {
    try {
        const feedback = await FeedBack.findById(req.params);
        if (!feedback) {
            return res.status(404).send('Le feedback spécifié n\'existe pas.');
        }
        await FeedBack.findByIdAndDelete(req.params);
        res.status(200).send('Feedback supprimé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la suppression du feedback dans la base de données :', error);
      res.status(500).send('Erreur lors de la suppression du feedback dans la base de données.');
    }
};  

async function update(req ,res){
    try {
        let feedback = await FeedBack.findById(req.params);
        if (!feedback) {
            return res.status(404).send('Le feedback spécifié n\'existe pas.');
        }
        feedback.texte = req.body;
        await feedback.save();
        res.status(200).send('Feedback mis à jour avec succès.');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du feedback dans la base de données :', error);
        res.status(500).send('Erreur lors de la mise à jour du feedback dans la base de données.');
     }
};

async function getFeedbackForInterview(req, res) {
    try {
        const { interviewId } = req.params;
        const feedback = await FeedBack.findOne({ interview: interviewId });
        if (!feedback) {
            return res.status(404).send('Feedback not found for this interview');
        }
        res.status(200).json({ text: feedback.texte });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).send('Internal Server Error');
    }
}

  module.exports = {save , getall , deleteTranscription , update , getFeedbackForInterview }
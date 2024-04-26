const Question = require('../models/question');

async function getAll(req, res) {
    try {
        const data = await Question.find();
        res.status(200).send(data);
    } catch (err) {
        res.status(400).send({ error: err });
    }
}
async function getByID (req, res) { 
    try {
      const data = await Question.findById(req.params.id)
      res.status(200).send(data);
    } catch (err) {
      res.status(400).send({error:err});
    }
  }
async function add(req, res) {
    try {
        console.log(req.body);
        const question = new Question(req.body);
        await question.save();
        res.status(200).send("added successfully");
    } catch (err) {
        res.status(400).send({ error: err });
        console.log(err.toString());
    }
}

async function update(req, res) {
    try {
        console.log(req.body);
        await Question.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send("updated");
    } catch (err) {
        res.status(400).send({ error: err });
    }
}
async function deleteQuestion(req, res) {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.status(200).send("deleted");
    } catch (err) {
        res.status(400).send({ error: err });
    }
}
async function getByNiveau (req, res) { 
    const { niveau } = req.params;
    try {
        const questions = await Question.find({ niveau });
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getByNiveauAndThematique (req, res) { 
    const { niveau, thematique } = req.params;
    try {
        const questions = await Question.find({ niveau, thematique });
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

 

module.exports = { getAll, getByID, add, update, deleteQuestion, getByNiveau, getByNiveauAndThematique};

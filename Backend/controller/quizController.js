
async function getAll(req, res) {
    try {
        const data = await Quiz.find();
        res.status(200).send(data);
    } catch (err) {
        res.status(400).send({ error: err });
    }
}
async function getByID (req, res) { 
    try {
      const data = await Quiz.findById(req.params.id)
      res.status(200).send(data);
    } catch (err) {
      res.status(400).send({error:err});
    }
  }
async function add(req, res) {
    try {
        console.log(req.body);
        const quiz = new Quiz(req.body);
        await quiz.save();
        res.status(200).send("added successfully");
    } catch (err) {
        res.status(400).send({ error: err });
        console.log(err.toString());
    }
}

async function update(req, res) {
    try {
        console.log(req.body);
        await Quiz.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send("updated");
    } catch (err) {
        res.status(400).send({ error: err });
    }
}
async function deleteQuiz(req, res) {
    try {
        await Quiz.findByIdAndDelete(req.params.id);
        res.status(200).send("deleted");
    } catch (err) {
        res.status(400).send({ error: err });
    }
}
async function getByNiveau (req, res) { 
    const { niveau } = req.params;
    try {
        const quizs = await Quiz.find({ niveau });
        res.json(quizs);
    } catch (error) {
        console.error('Error fetching quizs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getByNiveauAndThematique (req, res) { 
    const { niveau, thematique } = req.params;
    try {
        const quizs = await Quiz.find({ niveau, thematique });
        res.json(quizs);
    } catch (error) {
        console.error('Error fetching quizs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

 

module.exports = { getAll, getByID, add, update, deleteQuiz, getByNiveau, getByNiveauAndThematique};

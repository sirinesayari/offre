const Interview = require("../models/interview");
const User = require("../models/user");

async function add(req, res) {
    try {
        const { assignedStudentId, assignedStudentName, ...otherFields } = req.body;
        const assignedCompanyId = req.params.userId;
        const studentFullName = assignedStudentName.trim();
        const [studentFirstName, studentLastName] = studentFullName.split(' ');
        const student = await User.findOne({ firstname: studentFirstName, lastname: studentLastName });
        if (!student) {
            return res.status(404).send("Student not found");
        }

        const intrv = new Interview({
            ...otherFields,
            assignedCompanyId,
            assignedStudentId: student._id,
            assignedStudentName: `${student.firstname} ${student.lastname}`,
        });

        await intrv.save();
        res.status(200).send("add good");
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
}

async function getall(req,res){
    try{
        const data=await Interview.find();
        res.status(200).send(data);
    }catch(err){
        res.status(400).send(err);
    }
}

async function getallAsso(req, res) {
    try {
        const userId = req.params.id;
        const companyInterviews = await Interview.find({ assignedCompanyId: userId })
            .populate('assignedStudentId', 'firstname')
            .populate('assignedCompanyId');
        const studentInterviews = await Interview.find({ assignedStudentId: userId })
            .populate('assignedStudentId', 'firstname')
            .populate('assignedCompanyId'); 

        const allInterviews = [...companyInterviews, ...studentInterviews];
        res.status(200).send(allInterviews);
    } catch (err) {
        res.status(400).send(err);
    }
}

async function getbyid (req , res){
    try{
        const data = await Interview.findById(req.params.id);
        res.status(200).send(data);
    }catch(err){
        res.status(400).send(err);
    }
}

async function getbytitle(req,res){
    try{
        let title = req.params.title ;
        const datatitle = await Interview.findOne({ title }) ;
        res.status(200).send(datatitle);
    }catch(err){
        res.status(400).send(err);
    }
}

async function update(req ,res){
    try{
        await Interview.findByIdAndUpdate(req.params.id , req.body);
        res.status(200).send("updated");
    }catch(err){
        res.status(400).send(err);
    }
}

async function deleteinterview(req,res){
    try{
        await Interview.findByIdAndUpdate(req.params.id , { statusInterv: "Décliné" });
        res.status(200).send("archived");
    }catch(err){
        res.status(400).send(err);
    }
}

async function deleteinterviewB(req,res){
    try{
        await Interview.findByIdAndDelete(req.params.id);
        res.status(200).send("deleted");
    }catch(err){
        res.status(400).send(err);
    }
}

async function fixAnotherDate(req, res) {
    try { 
      await Interview.findByIdAndUpdate(req.params.id, { statusInterv: "Demande report" });
      res.status(200).json({ success: true, message: "Demande envoyée avec succès." });
      }catch(err){
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
  }

  async function getInterviewsByStudentId(req, res) {
    try {
      const studentId = req.params.id;
      const studentInterviews = await Interview.find({ assignedStudentId: studentId }).exec();
  
      if (studentInterviews.length === 0) {
        return res.status(404).send('Aucune entrevue trouvée pour cet ID d\'étudiant.');
      }
  
      res.status(200).send(studentInterviews);
    } catch (err) {
      res.status(500).send('Une erreur est survenue lors de la récupération des entrevues.');
    }
  }

  async function getInterviewsByCompagnyId(req, res) {
    try {
      const studentId = req.params.userId;
      const studentInterviews = await Interview.find({ assignedCompanyId: studentId }).exec();
  
      if (studentInterviews.length === 0) {
        return res.status(404).send('Aucune entrevue trouvée pour cet ID d\'étudiant.');
      }
  
      res.status(200).send(studentInterviews);
    } catch (err) {
      res.status(500).send('Une erreur est survenue lors de la récupération des entrevues.');
    }
  }
  async function getInterviewsByStudentName(req, res) {
    try {
      const studentName = req.params.name;
      const compagnyId = req.params.userId;

      console.log('Nom d\'étudiant:', studentName); // Vérifiez le nom d'étudiant
      const studentInterviews = await Interview.find({ assignedStudentName: studentName ,assignedCompanyId: compagnyId}).exec();
      console.log('Entretiens trouvés:', studentInterviews); // Vérifiez les entretiens trouvés
      if (studentInterviews.length === 0) {
        return res.status(404).send('Aucune entrevue trouvée pour cet étudiant.');
      }
  
      res.status(200).send(studentInterviews);
    } catch (err) {
      res.status(500).send('Une erreur est survenue lors de la récupération des entrevues.');
    }
}
  
async function updateInterviewValidation(req, res) {
    try {
        const interviewId = req.params.id;
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).send('Interview non trouvée.');
        }
        interview.validated = true;
        await interview.save();

        res.status(200).send('Interview validée avec succès.');
    } catch (err) {
        res.status(500).send('Une erreur est survenue lors de la validation de l\'interview.');
    }
}

async function updateInterviewNotValidation(req, res) {
    try {
        const interviewId = req.params.id;
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).send('Interview non trouvée.');
        }
        interview.validated = false;
        await interview.save();

        res.status(200).send('Interview validée avec succès.');
    } catch (err) {
        res.status(500).send('Une erreur est survenue lors de la validation de l\'interview.');
    }
}



module.exports = { add, getall,getallAsso ,getInterviewsByCompagnyId,  getbyid, getbytitle, update, deleteinterview , deleteinterviewB, fixAnotherDate ,getInterviewsByStudentId , getInterviewsByStudentName , updateInterviewValidation ,updateInterviewNotValidation };
  
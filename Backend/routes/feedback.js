const express = require ("express");
const router=express.Router()
const feedBackController = require("../controller/feedbackController");


router.get('/', function(req,res){
    res.send("hello express");
});

router.post('/save', feedBackController.save);
router.get('/getall', feedBackController.getall);
router.delete('/deleteTranscript/:id' , feedBackController.deleteTranscription)
router.put('/update/:id' , feedBackController.update);
router.get('/getfeedback/:interviewId', feedBackController.getFeedbackForInterview);


module.exports = router ;
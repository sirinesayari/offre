const express = require ("express");
const router=express.Router()
const intervController = require("../controller/InterviewController");
const validateInterv = require("../middl/validate") ;

router.get('/', function(req,res){
    res.send("hello express");
});

router.post("/add/:userId" ,intervController.add);
router.get('/getall', intervController.getall);
router.get('/getall/:id', intervController.getallAsso);
router.get("/get/:id",intervController.getbyid);
router.get("/getCompagny/:userId",intervController.getInterviewsByCompagnyId);

router.put('/update/:id', intervController.update);
router.delete('/deleteintrv/:id',intervController.deleteinterview );
router.get("/getitle/:title", intervController.getbytitle);
router.put("/fixAnotherDate/:id", intervController.fixAnotherDate);
router.delete("/deleteintrvB/:id" , intervController.deleteinterviewB);
router.get("/getInterviewsByStudentId/:id", intervController.getInterviewsByStudentId);
router.get("/getInterviewsByStudentName/:name/:userId", intervController.getInterviewsByStudentName);
router.put("/updateInterviewValidation/:id", intervController.updateInterviewValidation);
router.put("/updateInterviewNotValidation/:id", intervController.updateInterviewNotValidation);
module.exports = router ;
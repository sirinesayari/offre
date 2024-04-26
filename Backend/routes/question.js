const express = require("express");
const router = express.Router();

const questionController = require("../controller/questionController");

router.post("/add", questionController.add);
router.get("/getall", questionController.getAll);
router.put("/update/:id", questionController.update);
router.delete("/delete/:id", questionController.deleteQuestion);
router.get("/get/:id", questionController.getByID);
router.get('/getByNiveauAndThematique/:niveau/:thematique', questionController.getByNiveauAndThematique);

     
module.exports = router;

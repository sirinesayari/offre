const mongo = require ("mongoose");
const Schema =mongo.Schema 
const typeRencontreEnum = ["En ligne","En face"];
const typeIntrvEnum = ["Entretien avec le RH","Entretien technique" , "Entretien psychologique"];
const statusIntrvEnum =["En attente","Terminé" ,"En cours" , "A venir" , "Passé" , "Reporté" , "Demande report"]
const Interview = new Schema(
    {
        title: String,
        descrInter: String,
        dateInterv: Date,
        assignedCompanyId: {
            type: Schema.Types.ObjectId,
            ref: "user", 
        },
        assignedStudentId: {
            type: Schema.Types.ObjectId,
            ref: "user", 
        },
        assignedStudentName: String,
        address: String,
        typeRencontre: {
            type: String,
            enum: typeRencontreEnum,
            default: "En ligne"
        },
        typeIntrv: {
            type: String,
            enum: typeIntrvEnum,
            default: "Entretien avec le RH"
        },
        statusInterv: {
            type: String,
            enum: statusIntrvEnum,
            default: "A venir"
        },
        validated: { 
            type: Boolean,
            default: "false", 
        },
        feedbacks: [{ 
            type: Schema.Types.ObjectId,
            ref: "Feedback"
        }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongo.model("interview", Interview) ;
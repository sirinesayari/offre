const mongo = require ("mongoose");
const Schema =mongo.Schema 
const Role = require('./role'); 

const jwt = require("jsonwebtoken");



const User = new Schema(
    {
        firstname: String ,
        lastname : String,
        email : String,
        password : String,
        role: {
            type: String, 
            enum: Role.validRoles,
        },
        dateOfBirth: String,
        country : String,


        phone : Number,
        speciality : String,
        institution : String,
        languages : String,
        profileImage : String,
        description : String,
        skills : String,
        experience : String,
        formation : String,
        certificates : String,
        cV : String,
        googleId: String,
        secret :String,
        verified: { type: Boolean, default: false },


        // isEmailVerified: {
        //     type: Boolean,
        //     default: false,
        // },
        // verificationCode: String,

    }
);
User.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};


module.exports = mongo.model("User", User) ;



const router = require("express").Router();
const User  = require("../models/user");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const Token = require("../models/token");

router.post("/", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(401).send({ message: "Invalid Email or Password" });
		}

		const validPassword = await bcrypt.compare(req.body.password, user.password);
		if (!validPassword) {
			return res.status(401).send({ message: "Invalid Email or Password" });
		}

		if (!user.verified) {
			// Recherche d'un token existant ou génération d'un nouveau token
			let token = await Token.findOne({ userId: user._id });
			if (!token) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString("hex"),
				}).save();
			// Construction de l'URL pour la vérification d'email et envoi de l'email

				const url = `${process.env.BASE_URL}user/${user.id}/verify/${token.token}`;
				await sendEmail(user.email, "Verify Email", url);
			}

			return res.status(400).send({ message: "An Email has been sent to your account. Please verify your email address." });
		}
		// Si l'utilisateur est vérifié, génère un token d'authentification et le renvoie
		const authToken = user.generateAuthToken();
		res.status(200).send({ data: authToken, message: "Logged in successfully" });
	} catch (error) {
		console.error("Error occurred:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;

const express = require ("express");
const router=express.Router();
const User= require("../models/user");
const userController=require("../controller/userController");
const validate = require("../middl/validate");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path"); // Importer le module path

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/"); // Spécifiez le répertoire de destination où les fichiers seront stockés
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now()); // Générez un nom de fichier unique
  },
});
const upload = multer({ storage: storage });

// Route pour télécharger et stocker l'image
router.put("/uploadAvatar", upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.body.userId; // récupérer l'ID de l'utilisateur associé à l'image
    const avatarPath = req.file.path; // récupérer le chemin de l'image téléchargée

    // Enregistrer le chemin de l'image dans la base de données pour l'utilisateur avec l'ID correspondant
    await User.findByIdAndUpdate(userId, { profileImage: avatarPath });

    res.status(200).send("Avatar uploaded successfully");
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).send("An error occurred while uploading avatar");
  }
});

const cvStorage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, "images/"); // Spécifiez le répertoire de destination où les CV seront stockés
	},
	filename: function (req, file, cb) {
	  cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)); // Générez un nom de fichier unique avec extension
	},
  });
  
  const uploadCV = multer({ storage: cvStorage });
  
  // Route pour télécharger et stocker le CV
  router.put("/uploadCV/:userId", uploadCV.single("cV"), async (req, res) => {
	try {
		const userId = req.params.userId; // Récupérer l'ID de l'utilisateur à partir des paramètres de chemin
		const cvPath = req.file.path;
		console.log(userId); // Affiche l'ID de l'utilisateur récupéré
		console.log(cvPath)
	  // Enregistrer le chemin du CV dans la base de données pour l'utilisateur avec l'ID correspondant
	  await User.findByIdAndUpdate(userId, { cV: cvPath });
  
	  res.status(200).send("CV uploaded successfully");
	} catch (error) {
	  console.error("Error uploading CV:", error);
	  res.status(500).send("An error occurred while uploading CV");
	}
  });
  
  // Ajoutez d'autres routes et fonctions de contrôleur ici...
  
router.get('/images/:imageName', (req, res) => {
	const imageName = req.params.imageName;
	// Construire le chemin de l'image en utilisant path.join()
	const imagePath = path.join(__dirname, '..', 'images', imageName);
	// Envoyer le fichier image en tant que réponse
	res.sendFile(imagePath);
  });
  
// router.get('/', function(req,res){
//     res.send("hello user");
// });


router.post('/checkEmail', async (req, res) => {
	try {
	  const { email } = req.body;
	  const existingUser = await User.findOne({ email });
	  // Si existingUser est null, cela signifie que l'e-mail n'existe pas dans la base de données
	  res.json({ exists: !!existingUser }); // Retourne true si l'e-mail existe, sinon false
	} catch (error) {
	  console.error("Error checking email existence:", error);
	  res.status(500).json({ message: "An error occurred while checking email existence." });
	}
  });
  

  router.post("/search", async (req, res) => {
	try {
	  const filters = req.body; // Assuming the client sends filters in the request body
  
	  // Build the query object based on the received filters
	  const query = {};
  
	  // Check if any of the fields (firstname, lastname, speciality) exist in the filters
	  if (filters.firstname || filters.lastname || filters.speciality || filters.email || filters.institution) {
		// Construct a $or condition to search on any of the specified fields
		const orConditions = [];
  
		if (filters.firstname) {
		  orConditions.push({ firstname: { $regex: new RegExp(filters.firstname, "i") } });
		}
  
		if (filters.lastname) {
		  orConditions.push({ lastname: { $regex: new RegExp(filters.lastname, "i") } });
		}
  
		if (filters.speciality) {
		  orConditions.push({ speciality: { $regex: new RegExp(filters.speciality, "i") } });
		}
		
		if (filters.email) {
			orConditions.push({ email: { $regex: new RegExp(filters.email, "i") } });
		  }
		  if (filters.institution) {
			orConditions.push({ institution: { $regex: new RegExp(filters.institution, "i") } });
		  }
	
  
		// Add the $or condition to the query
		query.$or = orConditions;
	  }
  
	  // Execute the search query using the built query object
	  const users = await User.find(query);
  
	  res.json(users);
	} catch (error) {
	  console.error("Error searching users:", error);
	  res.status(500).send("An error occurred while searching users");
	}
  });

  

//postman
// router.post("/add",userController.add);
router.post("/login", userController.login)
router.post("/googlelogin",userController.googlelogin);
router.post("/storeUserRole", userController.storeUserRole); // Add this line
router.get("/profile/:id", userController.profile)



router.get('/getall' ,userController.getall);
router.get('/get/:id' ,userController.getbyid);

router.get('/getbyname/:name' ,userController.getbyname);
router.put('/updateUser/:id', userController.UpdateUser);

router.delete('/deleteUser/:id',userController.deleteUser);


// Ajoutez cette route pour trier les utilisateurs
router.post("/sort", userController.sortUsers);
// Assuming you have a route to fetch user role statistics
router.get("/userRoleStatistics", async (req, res) => {
	try {
	  const roleStatistics = await User.aggregate([
		{ $match: { verified: true } }, // Filter verified users
		{ $group: { _id: "$role", count: { $sum: 1 } } },
	  ]);
	  res.json(roleStatistics);
	} catch (error) {
	  console.error("Error fetching user role statistics:", error);
	  res.status(500).send("An error occurred while fetching user role statistics");
	}
  });

  router.get("/totalUsers", async (req, res) => {
	try {
	  // Count the total number of users where verified is true
	  const totalUsers = await User.countDocuments({ verified: true });
	  res.json({ totalUsers });
	} catch (error) {
	  console.error("Error fetching total users:", error);
	  res.status(500).send("An error occurred while fetching total users");
	}
  });
	
router.post("/", async (req, res) => {
	try {
		

		let user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		user = await new User({ ...req.body, password: hashPassword }).save();

		const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();
		const url = `${process.env.BASE_URL}user/${user.id}/verify/${token.token}`;
		await sendEmail(user.email, "Verify Email", url);

		res
			.status(201)
			.send({ message: "An Email sent to your account please verify" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/:id/verify/:token/", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) {
            return res.status(400).send({ message: "Invalid or expired token" });
        }

        if (user.verified) {
            return res.status(400).send({ message: "User already verified" });
        }

        await User.updateOne({ _id: user._id }, { verified: true });
        // Remove the token from database (if needed)
        // await token.remove();

        // Redirect to the specified URL after successful verification
        res.redirect("http://localhost:3000/authentication/sign-in");
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


  


module.exports = router ;